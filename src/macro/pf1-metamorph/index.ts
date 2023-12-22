import { UserWarning } from '../../common/error/user-warning'
import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'
import { findBuffInActor, findBuffInCompendium } from './buff'
import {
  MetamorphActorData,
  MetamorphBuffData,
  MetamorphSave,
  MetamorphTokenDocumentData,
  transformToMetamorphSaveIfValid,
} from './save'

const logger = getLoggerInstance()

const applyMetamorph = async (
  tokens: TokenPF[],
  compendiumName: string,
  buffName: string,
  buffLevel?: number,
) => {
  logger.info('Apply metamorph')

  const buffOperations = tokens.map(async ({ actor }) => {
    logger.debug('Create metamorph buff in actor', actor)

    const buff = await createBuff(actor, compendiumName, buffName)

    const updateQuery = {
      'system.level': buffLevel,
      'system.active': true,
    }

    return buff.update(updateQuery)
  })

  const actorsOperations = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to actor', actor)

    return actor.update({
      'system.traits.size': 'sm',
      'flags.metamorph': {
        ...actor.flags?.metamorph,
        active: true,
      },
    })
  })

  const tokensOperations = tokens.map(async (token) => {
    logger.debug('Apply metamorph to token', token)

    return token.document.update({
      'texture.src':
        'https://assets.forge-vtt.com/62ab17b89633ba24d7994900/tokens/PC/Seioden%20v2.png',
    })
  })

  const operations = [
    ...buffOperations,
    ...actorsOperations,
    ...tokensOperations,
  ]

  await Promise.all(operations)
}

const createBuff = async (
  actor: ActorPF,
  compendiumName: string,
  buffName: string,
): Promise<ItemBuffPF> => {
  const buff = findBuffInCompendium(compendiumName, buffName)
  if (buff === undefined) {
    throw new Error(
      `Could not find buff ${buffName} in compendium ${compendiumName}`,
    )
  }

  const documents = await actor.createEmbeddedDocuments('Item', [buff])

  const createdBuff = documents[0]

  if (createdBuff === undefined) {
    throw new Error(`Could not create buff ${buffName} in actor`)
  }

  return createdBuff as ItemBuffPF
}

const checkTokens = (tokens: TokenPF[]) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning('Au moins un token a déjà un effet')
    }
  }
}

const savePolymorphData = async (tokens: TokenPF[], buffName: string) => {
  logger.info('Save data to actor flags to ensure rolling back is possible')

  const operations = tokens.map(async (token) => {
    logger.debug('Save data related to a token', token)

    const actorData: MetamorphActorData = {
      system: {
        traits: {
          size: token.actor.system.traits.size,
        },
      },
    }
    const tokenDocumentData: MetamorphTokenDocumentData = {
      texture: {
        src: token.document.texture.src,
      },
    }
    const buffData: MetamorphBuffData = {
      name: buffName,
    }

    const save: MetamorphSave = {
      actorData,
      tokenDocumentData,
      buffData,
    }

    await token.actor.update({
      flags: {
        metamorph: {
          save,
        },
      },
    })
  })

  await Promise.all(operations)
}

const rollbackToPrePolymorphData = async (tokens: TokenPF[]) => {
  logger.info('Prepare to roll back to data before polymorph was triggered')

  const rollbackActions: (Promise<Document> | Promise<Document[]>)[] = tokens
    .map((token) => {
      logger.debug('Rolling back token', token)

      const save = transformToMetamorphSaveIfValid(
        token.actor.flags?.metamorph?.save,
      )

      logger.debug('Save obtained from token actor', save)

      if (save === undefined) {
        throw new Error('Save is not valid')
      }

      const currentRollBackActions: (
        | Promise<Document>
        | Promise<Document[]>
      )[] = [
        token.document.update(save.tokenDocumentData),
        token.actor.update({
          ...save.actorData,
          flags: {
            metamorph: {
              ...token.actor.flags?.metamorph,
              active: false,
            },
          },
        }),
      ]

      const buff = findBuffInActor(token.actor, save.buffData.name)
      if (buff !== undefined) {
        currentRollBackActions.push(
          token.actor.deleteEmbeddedDocuments('Item', [buff.id]),
        )
      } else {
        logger.warn(`Could not find ${save.buffData.name} buff in actor`)
      }

      return currentRollBackActions
    })
    .flat()

  logger.info('Trigger rollback')

  await Promise.all(rollbackActions)

  logger.info('Rollback complete')
}

const main = async (): Promise<void> => {
  logger.level = LogLevel.DEBUG

  const {
    tokens: { controlled },
  } = canvas

  if (controlled.length === 0) {
    ui.notifications.info("Aucun token n'est sélectionné")
    return
  }

  const buffName = 'rapetissement'
  const compendiumName = 'world.effets-metamorph'

  checkTokens(controlled)

  await savePolymorphData(controlled, buffName)
  await applyMetamorph(controlled, compendiumName, buffName, 15)

  await new Promise((resolve) => setTimeout(resolve, 5000))

  await rollbackToPrePolymorphData(controlled)
}

main().catch((error) => {
  if (error instanceof UserWarning) {
    ui.notifications.warn(error.message)
    return
  }

  ui.notifications.error(
    "L'exécution du script à échoué, voir la console pour plus d'information",
  )
  console.error(error)
})
