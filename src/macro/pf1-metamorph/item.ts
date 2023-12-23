import { getLoggerInstance } from '../../common/log/logger'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'
import {
  ItemPF,
  ItemPFType,
} from '../../type/foundry/system/pf1/documents/item/item-pf'

const logger = getLoggerInstance()

export const findItemInActor = <T extends ItemPF = ItemPF>(
  actor: ActorPF,
  itemName: string,
  itemType: ItemPFType,
): T | undefined =>
  actor.items.find(
    ({ name, type }) =>
      name.toLowerCase() === itemName.toLowerCase() && type === itemType,
  ) as T

export const findItemInCompendium = async <T extends ItemPF = ItemPF>(
  compendiumName: string,
  itemName: string,
  itemType: ItemPFType,
): Promise<T | undefined> => {
  const compendiumCollection = game.packs.get(compendiumName)
  const itemDescriptor = compendiumCollection.index.find(
    ({ name, type }) =>
      name.toLowerCase() === itemName.toLowerCase() && type === itemType,
  )

  if (itemDescriptor === undefined) {
    return undefined
  }

  const item = await compendiumCollection.getDocument<ItemBuffPF>(
    itemDescriptor._id,
  )
  if (item === undefined) {
    logger.warn(
      'Could not find item in compendium even though its descriptor was found',
    )
    return undefined
  }

  return item as T
}

export const createItemInActor = async <T extends ItemPF = ItemPF>(
  actor: ActorPF,
  item: ItemPF,
): Promise<T> => {
  const documents = await actor.createEmbeddedDocuments('Item', [item])

  const createdItem = documents[0]

  if (createdItem === undefined) {
    throw new Error(`Could not create item ${item.name} in actor`)
  }

  return createdItem as T
}
