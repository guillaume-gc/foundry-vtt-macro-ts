import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { EmbeddedCollection } from '../../type/foundry/abstract/embedded-collection'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import {
  ActorPFDamageReduction,
  ActorPFEnergyResistance,
  ActorPFSenses,
  ActorPFSize,
  ActorPFSpeed,
  ActorPFStature,
} from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'
import { ItemFeatPF } from '../../type/foundry/system/pf1/documents/item/item-feat-pf'
import {
  ItemPF,
  ItemPFType,
} from '../../type/foundry/system/pf1/documents/item/item-pf'
import { Collection } from '../../type/foundry/utils/collection'
import {
  MetamorphTransformation,
  MetamorphTransformationActorItem,
  MetamorphTransformationCompendiumItem,
} from './config'
import { findItemsInActor } from './item'

export interface MetamorphActorData {
  system: {
    attributes: {
      speed: ActorPFSpeed
    }
    traits: {
      size: ActorPFSize
      stature: ActorPFStature
      senses: ActorPFSenses
      dr: ActorPFDamageReduction
      eres: ActorPFEnergyResistance
    }
  }
  prototypeToken: MetamorphTokenDocumentData
  img: string
}

export interface MetamorphTokenDocumentData {
  texture: {
    src: string
  }
}

export interface TransformModifiedBuff {
  name: string
  type: ItemPFType
  data: {
    active: boolean
  }
}

export interface MetamorphSave {
  actorData: MetamorphActorData
  tokenDocumentData: MetamorphTokenDocumentData
  transformAddedItemsData: MetamorphTransformationCompendiumItem[]
  transformModifiedItem?: TransformModifiedBuff[]
}

const logger = getLoggerInstance()

/*
 * Transform the value to MetamorphSave, if valid.
 *
 * To keep the function simple, it's just checking root attributes.
 */
export const transformToMetamorphSave = (
  value: Record<string, any> | undefined,
): MetamorphSave => {
  logger.debug('Transform flags to metamorph if they are valid', value)

  if (value === undefined) {
    throw new Error('Flag values are undefined')
  }

  const {
    actorData: {
      system: { traits: { size: actorSize = undefined } = {} } = {},
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = undefined } = {},
    } = {},
    transformItemsData,
  } = value

  logger.debug('Extracted values in flags', {
    actorSize,
    tokenTextureSrc,
    transformItemsData,
  })

  if (
    actorSize === undefined ||
    tokenTextureSrc === undefined ||
    transformItemsData === undefined
  ) {
    throw new Error('Flag values are invalid')
  }

  return value as MetamorphSave
}

/*
 * Save polymorph data to actor flags.
 */
export const savePolymorphData = async (
  tokens: TokenPF[],
  metamorphTransform: MetamorphTransformation,
) => {
  logger.info('Save data to actor flags to ensure rolling back is possible')

  const operations = tokens.map(async (token) => {
    logger.debug('Save data related to a token', token)

    const actorData: MetamorphActorData = {
      system: {
        attributes: {
          speed: token.actor.system.attributes.speed,
        },
        traits: {
          size: token.actor.system.traits.size,
          stature: token.actor.system.traits.stature,
          senses: token.actor.system.traits.senses,
          dr: token.actor.system.traits.dr,
          eres: token.actor.system.traits.eres,
        },
      },
      prototypeToken: {
        texture: {
          src: token.document.texture.src,
        },
      },
      img: token.actor.img,
    }
    const tokenDocumentData: MetamorphTokenDocumentData = {
      texture: {
        src: token.document.texture.src,
      },
    }

    const save: MetamorphSave = {
      actorData,
      tokenDocumentData,
      transformAddedItemsData: metamorphTransform.itemsToAdd,
      transformModifiedItem: getTransformModifiedBuff(
        token.actor.items,
        metamorphTransform.itemsToModify,
      ),
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

const getTransformModifiedBuff = (
  actorItems: EmbeddedCollection<ItemPF>,
  itemsToModify: MetamorphTransformationActorItem[] | undefined,
): TransformModifiedBuff[] | undefined => {
  if (itemsToModify === undefined) {
    return undefined
  }

  return actorItems.reduce<TransformModifiedBuff[]>(
    (accumulator, currentItem) => {
      if (
        itemsToModify.some(
          (item) =>
            item.name === currentItem.name && item.type === currentItem.type,
        )
      ) {
        accumulator.push({
          name: currentItem.name,
          type: currentItem.type,
          data: {
            active: currentItem.isActive,
          },
        })
      }

      return accumulator
    },
    [],
  )
}

/*
 * Rollback to pre-polymorph data using actor flags.
 */
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

      if (save.transformModifiedItem !== undefined) {
        currentRollBackActions.push(
          Promise.all(
            updateModifiedItem(save.transformModifiedItem, token.actor.items),
          ),
        )
      }

      logger.debug('Delete all metamorph related items', save)

      const itemsToDelete = save.transformAddedItemsData.reduce<ItemPF[]>(
        (previousItems, currentItem) => {
          const actorItems = findItemsInActor(
            token.actor,
            currentItem.name,
            currentItem.type,
          )

          if (actorItems.length > 0) {
            previousItems.push(...actorItems)
          } else {
            logger.warn(`Could not find ${currentItem.name} item(s) in actor`)
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

const updateModifiedItem = (
  saveTransformModifiedItems: TransformModifiedBuff[],
  actorItems: Collection<ItemPF>,
) =>
  actorItems.reduce<Promise<Document>[]>((accumulator, currentItem) => {
    const save = saveTransformModifiedItems.find(
      (value) =>
        value.name == currentItem.name && value.type === currentItem.type,
    )
    if (save === undefined) {
      return accumulator
    }

    if (currentItem.type === 'buff') {
      accumulator.push(
        (currentItem as ItemBuffPF).update({
          system: {
            active: save.data.active,
          },
        }),
      )
    } else if (currentItem.type === 'feat') {
      accumulator.push(
        (currentItem as ItemFeatPF).update({
          system: {
            disabled: !save.data.active,
          },
        }),
      )
    } else {
      logger.warn('A modified item has expected type', currentItem)
    }

    return accumulator
  }, [])
