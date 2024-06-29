import { EmbeddedCollection } from '../../../type/foundry/abstract/embedded-collection'
import { ItemBuffPF } from '../../../type/foundry/system/pf1/documents/item/item-buff-pf'
import { ItemFeatPF } from '../../../type/foundry/system/pf1/documents/item/item-feat-pf'
import { ItemPF } from '../../../type/foundry/system/pf1/documents/item/item-pf'
import {
  MetamorphItemTransformationAction,
  MetamorphTransformationActorItem,
} from '../config'

export const createModifyActorItemUpdates = (
  actorItems: EmbeddedCollection<ItemPF>,
  itemsToModify: MetamorphTransformationActorItem[],
): Promise<ItemPF[]> =>
  Promise.all(
    actorItems.reduce<Promise<ItemPF>[]>((accumulator, currentItem) => {
      const modification = itemsToModify.find(
        (item) =>
          item.name === currentItem.name && item.type === currentItem.type,
      )

      if (modification === undefined) {
        return accumulator
      }

      accumulator.push(createUpdate(currentItem, modification.action))

      return accumulator
    }, []),
  )

const createUpdate = (
  item: ItemPF,
  action: MetamorphItemTransformationAction,
): Promise<ItemPF> => {
  switch (action) {
    case 'disable':
      return createDisableItemUpdate(item)
  }
}

const createDisableItemUpdate = (item: ItemPF): Promise<ItemPF> => {
  if (item.type === 'buff') {
    return (item as ItemBuffPF).update({
      system: {
        active: false,
      },
    })
  }
  if (item.type === 'feat') {
    return (item as ItemFeatPF).update({
      system: {
        disabled: true,
      },
    })
  }

  throw new Error(
    `Unexpected item type ${item.type}, cannot create disable action update`,
  )
}
