import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'

export const findBuffInActor = (
  actor: ActorPF,
  buffName: string,
): ItemBuffPF | undefined =>
  actor.items.find(
    ({ name, type }) =>
      name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
  )

export const findBuffInCompendium = (
  compendiumName: string,
  buffName: string,
): ItemBuffPF | undefined =>
  game.packs
    .get(compendiumName)
    .index.find(
      ({ name, type }) =>
        name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
    )

export const applyBuffToActor = async (
  actor: ActorPF,
  compendiumName: string,
  buffName: string,
): Promise<ItemBuffPF> => {
  const buff = findBuffInCompendium(compendiumName, buffName)
  if (buff === undefined) {
    throw new Error(
      `Could not find buff ${buffName} in compendium ${compendiumName}`,
    )
  }

  const documents = await actor.createEmbeddedDocuments('Item', [buff])

  const createdBuff = documents[0]

  if (createdBuff === undefined) {
    throw new Error(`Could not create buff ${buffName} in actor`)
  }

  return createdBuff as ItemBuffPF
}
