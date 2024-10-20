import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { EmbeddedCollection } from '../../type/foundry/abstract/embedded-collection'
import { DocumentOwnershipLevelRecord } from '../../type/foundry/const/document-ownership-level'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import {
  ActorPFDamageReduction,
  ActorPFDetails,
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
  MetamorphElementTransformation,
  MetamorphTransformationActorItem,
  MetamorphTransformationCompendiumItem,
} from './config'
import { findItemsInActor } from './item'

export interface MetamorphActorData {
  name: string
  system: {
    details: ActorPFDetails
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
  ownership: DocumentOwnershipLevelRecord
}

export interface MetamorphTokenDocumentData {
  texture: {
    src: string
    scaleX: number
    scaleY: number
  }
  name: string
}

export interface TransformModifiedItem {
  name: string
  type: ItemPFType
  data: {
    active: boolean
  }
}

export interface MetamorphSave {
  actorData: MetamorphActorData
  tokenDocumentData: MetamorphTokenDocumentData
  transformAddedItemsData?: MetamorphTransformationCompendiumItem[]
  transformModifiedItem?: TransformModifiedItem[]
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
  } = value

  logger.debug('Extracted values in flags', {
    actorSize,
    tokenTextureSrc,
  })

  if (actorSize === undefined || tokenTextureSrc === undefined) {
    throw new Error('Flag root values are invalid')
  }

  return value as MetamorphSave
}

/*
 * Save metamorph data to actor flags.
 */
export const saveMetamorphData = async (
  tokens: TokenPF[],
  metamorphElementTransformEffect: MetamorphElementTransformation,
) => {
  logger.info('Save data to actor flags to ensure rolling back is possible')

  const operations = tokens.map(async (token) => {
    logger.debug('Save data related to a token', token)

    const actorData: MetamorphActorData = {
      name: token.actor.name,
      system: {
        attributes: {
          speed: token.actor.system.attributes.speed,
        },
        details: {
          biography: {
            value: token.actor.system.details.biography.value,
          },
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
          scaleX: token.document.texture.scaleX,
          scaleY: token.document.texture.scaleY,
        },
        name: token.document.name,
      },
      img: token.actor.img,
      ownership: token.actor.ownership,
    }
    const tokenDocumentData: MetamorphTokenDocumentData = {
      texture: {
        src: token.document.texture.src,
        scaleX: token.document.texture.scaleX,
        scaleY: token.document.texture.scaleY,
      },
      name: token.document.name,
    }

    const save: MetamorphSave = {
      actorData,
      tokenDocumentData,
      transformAddedItemsData: metamorphElementTransformEffect.items?.toAdd,
      transformModifiedItem: getTransformModifiedBuff(
        token.actor.items,
        metamorphElementTransformEffect.items?.toModify,
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
): TransformModifiedItem[] | undefined => {
  if (itemsToModify === undefined) {
    return undefined
  }

  return actorItems.reduce<TransformModifiedItem[]>(
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
 * Rollback to pre-metamorph data using actor flags.
 */
export const rollbackToPreMetamorphData = async (tokens: TokenPF[]) => {
  logger.info('Prepare to roll back to data before metamorph was triggered')

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
        logger.debug('Get items to rollback', save)

        currentRollBackActions.push(
          Promise.all(
            rollbackModifiedItem(save.transformModifiedItem, token.actor.items),
          ),
        )
      }

      if (save.transformAddedItemsData !== undefined) {
        logger.debug('Get items to delete', save)

        const itemsToDelete = getItemsToDelete(
          token,
          save.transformAddedItemsData,
        )

        logger.debug(`Got ${itemsToDelete.length} items to delete`, {
          itemsToDelete,
        })

        currentRollBackActions.push(
          token.actor.deleteEmbeddedDocuments(
            'Item',
            itemsToDelete.map(({ id }) => id),
          ),
        )
      }

      return currentRollBackActions
    })
    .flat()

  logger.info('Trigger rollback')

  await Promise.all(rollbackActions)

  logger.info('Rollback complete')
}

const getItemsToDelete = (
  token: TokenPF,
  transformAddedItemsData: MetamorphTransformationCompendiumItem[],
): ItemPF[] =>
  transformAddedItemsData.reduce<ItemPF[]>((previousItems, currentItem) => {
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
  }, [])

const rollbackModifiedItem = (
  saveTransformModifiedItems: TransformModifiedItem[],
  actorItems: Collection<ItemPF>,
) =>
  actorItems.reduce<Promise<Document>[]>((accumulator, currentItem) => {
    const save = saveTransformModifiedItems.find(
      (value) =>
        value.name === currentItem.name && value.type === currentItem.type,
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
