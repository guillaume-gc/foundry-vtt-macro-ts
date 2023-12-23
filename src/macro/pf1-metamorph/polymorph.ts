import { UserWarning } from '../../common/error/user-warning'
import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPF } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { MetamorphTransformation, MetamorphTransformationItem } from './config'
import {
  createItemInActor,
  findItemInActor,
  findItemInCompendium,
} from './item'
import {
  MetamorphActorData,
  MetamorphSave,
  MetamorphTokenDocumentData,
  transformToMetamorphSave,
} from './save'

const logger = getLoggerInstance()

/*
 * Add to the actor all necessary items for its transformation
 */
const addTransformationItemToActor = async (
  actor: ActorPF,
  item: MetamorphTransformationItem,
  metamorphTransformSpellLevel?: number,
) => {
  logger.debug('Prepare to add item to actor', item)

  const compendiumItem = await findItemInCompendium(
    item.compendiumName,
    item.name,
    item.type,
  )

  if (compendiumItem === undefined) {
    throw new Error(
      `Could not find buff ${item.name} (type ${item.type}) in compendium ${item.compendiumName}`,
    )
  }

  logger.debug('Found item in compendium', {
    compendiumItem,
    itemCompendiumName: item.compendiumName,
    itemName: item.name,
  })

  const actorItem = await createItemInActor(actor, compendiumItem)

  return updateAddedTransformationItem(actorItem, metamorphTransformSpellLevel)
}

/*
 * Update the added item, if necessary.
 */
const updateAddedTransformationItem = async (
  item: ItemPF,
  metamorphTransformSpellLevel?: number,
): Promise<Document> => {
  if (item.type === 'buff') {
    return item.update({
      'system.level': metamorphTransformSpellLevel,
      'system.active': true,
    })
  }

  return item
}

/*
 * Transform an actor
 */
export const applyMetamorph = async (
  tokens: TokenPF[],
  metamorphTransform: MetamorphTransformation,
  metamorphTransformSpellLevel?: number,
) => {
  logger.info('Apply metamorph')

  const { tokenTexture, items } = metamorphTransform

  const itemActions = tokens.map(async ({ actor }) => {
    logger.debug('Create metamorph items in actor', actor)

    const individualItemActions = items.map((item) =>
      addTransformationItemToActor(actor, item, metamorphTransformSpellLevel),
    )

    return Promise.all(individualItemActions)
  })

  const actorsActions = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to actor', actor)

    return actor.update({
      'system.traits.size': metamorphTransform.size,
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

  const applyActions = [...itemActions, ...actorsActions, ...tokensActions]

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
  metamorphTransform: MetamorphTransformation,
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

    const save: MetamorphSave = {
      actorData,
      tokenDocumentData,
      transformItemsData: metamorphTransform.items,
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

      const save = transformToMetamorphSave(token.actor.flags?.metamorph?.save)

      logger.debug('Save obtained from token actor', save)

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

      const itemsToDelete = save.transformItemsData.reduce<ItemPF[]>(
        (previousItems, currentItem) => {
          const actorItem = findItemInActor(
            token.actor,
            currentItem.name,
            currentItem.type,
          )

          if (actorItem !== undefined) {
            previousItems.push(actorItem)
          } else {
            logger.warn(`Could not find ${currentItem.name} item in actor`)
          }

          return previousItems
        },
        [],
      )

      logger.debug(`Ready to delete ${itemsToDelete.length} items`, {
        itemsToDelete,
      })

      currentRollBackActions.push(
        token.actor.deleteEmbeddedDocuments(
          'Item',
          itemsToDelete.map(({ id }) => id),
        ),
      )

      return currentRollBackActions
    })
    .flat()

  logger.info('Trigger rollback')

  await Promise.all(rollbackActions)

  logger.info('Rollback complete')
}
