import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'

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
      ({ name, type }) =>
        name.toLowerCase() === buffName.toLowerCase() && type === 'buff',
    )
