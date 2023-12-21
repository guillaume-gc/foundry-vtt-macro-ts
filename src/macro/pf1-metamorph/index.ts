import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { findBuffInActor } from './buff'
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
  buffName: string,
  buffLevel?: number,
) => {
  logger.info('Apply metamorph')

  const buffOperations = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to buff', actor)

    const buff = findBuffInActor(actor, buffName)

    const updateQuery = {
      'system.level': buffLevel,
      'system.active': true,
    }

    return buff.update(updateQuery)
  })

  const actorsOperations = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to actor', actor)

    return actor.update({ 'system.traits.size': 'huge' })
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

      const buff = findBuffInActor(token.actor, save.buffData.name)

      return [
        token.document.update(save.tokenDocumentData),
        token.actor.update(save.actorData),
        token.actor.deleteEmbeddedDocuments('Item', [buff.id]),
      ]
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

  const buffName = 'Vision des Héros des Terres Inondées'

  await savePolymorphData(controlled, buffName)
  await applyMetamorph(controlled, buffName, 15)

  await new Promise((resolve) => setTimeout(resolve, 5000))

  await rollbackToPrePolymorphData(controlled)
}

main().catch((error) => {
  ui.notifications.error(
    "L'exécution du script à échoué, voir la console pour plus d'information",
  )
  console.error(error)
})
