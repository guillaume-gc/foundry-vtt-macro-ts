import { getLoggerInstance } from '../../../common/log/logger'
import { Document } from '../../../type/foundry/abstract/document'
import { ItemAction } from '../../../type/foundry/system/pf1/components/item-action'
import { ActorPF } from '../../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../../type/foundry/system/pf1/documents/item/item-buff-pf'
import { ItemPF } from '../../../type/foundry/system/pf1/documents/item/item-pf'
import { Collection } from '../../../type/foundry/utils/collection'
import { MetamorphTransformationCompendiumItem } from '../config'
import { findItemInCompendium } from '../item'
import { MetamorphOptions } from '../polymorph'

const logger = getLoggerInstance()

export const createAddItemsUpdates = async (
  actor: ActorPF,
  itemsToAdd: MetamorphTransformationCompendiumItem[],
  options: MetamorphOptions | undefined,
): Promise<Document[]> => {
  logger.debug('Creating update to add objects', {
    actor,
    itemsToAdd,
  })

  const newItemPFsArray = await Promise.all(
    itemsToAdd.map(async (item) => {
      const itemPF = await findItemInCompendium(
        item.compendiumName,
        item.name,
        item.type,
      )

      if (itemPF === undefined) {
        throw new Error(
          `Could not find item ${item.name} (type ${item.type}) in compendium ${item.compendiumName}`,
        )
      }

      logger.debug('Found itemPF in compendium', {
        itemPF,
        itemCompendiumName: item.compendiumName,
        itemName: item.name,
      })

      // if (options) {
      //   customizeItemPF(itemPF, options)
      // }

      return itemPF
    }),
  )

  logger.debug('Items to add to actor ready for update creation', {
    newItemPFsArray,
  })

  return actor.createEmbeddedDocuments('Item', newItemPFsArray)
}

/*
 * Set up real time date in relation to metamorph option
 */
const customizeItemPF = (item: ItemPF, options: MetamorphOptions) => {
  logger.debug('Customize ItemPF before creating update', {
    item,
  })

  if (options === undefined) {
    return
  }

  if (item.type === 'buff') {
    customizeItemBuffPF(item as ItemBuffPF, options)
  }

  if (item.hasAction) {
    customizeItemActions(item.actions, options)
  }

  logger.debug('Customized ItemPF', {
    item,
  })
}

const customizeItemBuffPF = (item: ItemBuffPF, options: MetamorphOptions) => {
  if (options.metamorphTransformSpellLevel) {
    item.system.level = options.metamorphTransformSpellLevel
  }

  item.system.active = true
}

const customizeItemActions = (
  itemActions: Collection<ItemAction>,
  options: MetamorphOptions,
) => {
  if (options.metamorphSpellDifficultyCheck === undefined) {
    return
  }

  for (const action of itemActions) {
    action.data.save.dc = options?.metamorphSpellDifficultyCheck?.toString()
  }
}
