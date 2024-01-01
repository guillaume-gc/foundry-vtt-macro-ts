import { getLoggerInstance } from '../../common/log/logger'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import {
  ItemPF,
  ItemPFType,
} from '../../type/foundry/system/pf1/documents/item/item-pf'

const logger = getLoggerInstance()

/*
 * Find all items in an actor of a given name and type.
 */
export const findItemsInActor = <T extends ItemPF[] = ItemPF[]>(
  actor: ActorPF,
  itemName: string,
  itemType: ItemPFType,
): T =>
  actor.items.filter(
    ({ name, type }) =>
      name.toLowerCase() === itemName.toLowerCase() && type === itemType,
  ) as T

/*
 * Find the first item in a compendium of a given name and type.
 */
export const findItemInCompendium = async <T extends ItemPF = ItemPF>(
  compendiumName: string,
  itemName: string,
  itemType: ItemPFType,
): Promise<T | undefined> => {
  logger.debug('Find item in compendium', {
    compendiumName,
  })

  const compendiumCollection = game.packs.get(compendiumName)

  logger.debug('Compendium found', {
    compendiumCollection,
  })

  const itemDescriptor = compendiumCollection.index.find(
    ({ name, type }) =>
      name.toLowerCase() === itemName.toLowerCase() && type === itemType,
  )

  if (itemDescriptor === undefined) {
    logger.debug('Item descriptor not found')
    return undefined
  }

  const item = await compendiumCollection.getDocument<T>(itemDescriptor._id)
  if (item === undefined) {
    logger.warn(
      'Could not find item in compendium even though its descriptor was found',
    )
    return undefined
  }

  logger.debug('Item found', {
    item,
  })

  return item
}

/*
 * Create a specific item in an actor.
 */
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
