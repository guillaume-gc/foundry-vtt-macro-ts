import { UserWarning } from '../../common/error/user-warning'
import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { applyBuffToActor, findBuffInActor } from './buff'
import {
  MetamorphActorData,
  MetamorphBuffData,
  MetamorphSave,
  MetamorphTokenDocumentData,
  transformToMetamorphSaveIfValid,
} from './save'

const logger = getLoggerInstance()

export const applyMetamorph = async (
  tokens: TokenPF[],
  compendiumName: string,
  buffName: string,
  buffLevel?: number,
  tokenTexture?: string,
) => {
  logger.info('Apply metamorph')

  const buffActions = tokens.map(async ({ actor }) => {
    logger.debug('Create metamorph buff in actor', actor)

    const buff = await applyBuffToActor(actor, compendiumName, buffName)

    const updateQuery = {
      'system.level': buffLevel,
      'system.active': true,
    }

    return buff.update(updateQuery)
  })

  const actorsActions = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to actor', actor)

    return actor.update({
      'system.traits.size': 'sm',
      'flags.metamorph': {
        ...actor.flags?.metamorph,
        active: true,
      },
    })
  })

  const tokensActions = tokens.map(async (token) => {
    logger.debug('Apply metamorph to token', token)

    return token.document.update({
      'texture.src': tokenTexture,
    })
  })

  const applyActions = [...buffActions, ...actorsActions, ...tokensActions]

  await Promise.all(applyActions)
}

export const checkTokens = (tokens: TokenPF[]) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning('Au moins un token a déjà un effet')
    }
  }
}

export const savePolymorphData = async (
  tokens: TokenPF[],
  buffName: string,
) => {
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

export const rollbackToPrePolymorphData = async (tokens: TokenPF[]) => {
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
