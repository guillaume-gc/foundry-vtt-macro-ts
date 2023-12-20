import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff'
import { ItemPF } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { ActorPF } from '../../type/foundry/system/pf1/pf1'

export const findBuffInActor = (actor: ActorPF, buffName: string): ItemBuffPF =>
  actor.items.find(
    ({ name, type }) =>
      name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
  )

export const findBuffInCompendium = (
  compendiumName: string,
  buffName: string,
) =>
  game.packs
    .get(compendiumName)
    .index.find(
      ({ name, type }: ItemPF) =>
        name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
    )
