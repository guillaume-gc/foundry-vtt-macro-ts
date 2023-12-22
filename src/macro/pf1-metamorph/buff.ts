import { getLoggerInstance } from '../../common/log/logger'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'

const logger = getLoggerInstance()

export const findBuffInActor = (
  actor: ActorPF,
  buffName: string,
): ItemBuffPF | undefined =>
  actor.items.find(
    ({ name, type }) =>
      name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
  )

export const findBuffInCompendium = async (
  compendiumName: string,
  buffName: string,
): Promise<ItemBuffPF | undefined> => {
  const compendiumCollection = game.packs.get(compendiumName)
  const buffDescriptor = compendiumCollection.index.find(
    ({ name, type }) =>
      name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
  )

  if (buffDescriptor === undefined) {
    return undefined
  }

  const buff = await compendiumCollection.getDocument<ItemBuffPF>(
    buffDescriptor._id,
  )
  if (buff === undefined) {
    logger.warn(
      'Could not find buff in compendium even though its descriptor was found',
    )
    return undefined
  }

  return buff
}

export const createBuffInActor = async (
  actor: ActorPF,
  buff: ItemBuffPF,
): Promise<ItemBuffPF> => {
  const documents = await actor.createEmbeddedDocuments('Item', [buff])

  const createdBuff = documents[0]

  if (createdBuff === undefined) {
    throw new Error(`Could not create buff ${buff.name} in actor`)
  }

  return createdBuff as ItemBuffPF
}
