import {
  ActorPFDamageReduction,
  ActorPFEnergyResistance,
  ActorPFSenses,
  ActorPFSize,
  ActorPFSpeed,
  ActorPFStature,
} from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPFType } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { RecursivePartial } from '../../type/foundry/utils/partial'
import { MetamorphFilter } from './filter'
import { MetamorphOwnershipChanges } from './ownership'

export type MetamorphElementsRecord = Record<string, MetamorphElement>

export interface MetamorphTransformationCompendiumItem {
  name: string
  compendiumName: string
  type: ItemPFType
}

export type MetamorphItemTransformationAction = 'disable'

export interface MetamorphTransformationActorItem {
  name: string
  type: ItemPFType
  action: MetamorphItemTransformationAction
}

interface BaseMetamorphElement {
  label: string
  description?: string
}

export type MetamorphElement =
  | MetamorphElementGroup
  | MetamorphElementTransformation

export interface MetamorphElementGroup extends BaseMetamorphElement {
  type: 'group'
  elementChildren: MetamorphElementsRecord
}

export interface MetamorphElementTransformation extends BaseMetamorphElement {
  type: 'transformation'
  requirement?: MetamorphFilter
  itemsToAdd?: MetamorphTransformationCompendiumItem[]
  itemsToModify?: MetamorphTransformationActorItem[]
  size?: ActorPFSize
  stature?: ActorPFStature
  speed?: RecursivePartial<ActorPFSpeed>
  tokenTextureSrc?: string
  actorImg?: string
  senses?: Partial<ActorPFSenses>
  damageReduction?: ActorPFDamageReduction
  energyResistance?: ActorPFEnergyResistance
  ownershipChanges?: MetamorphOwnershipChanges
}

export interface MetamorphConfig {
  style: {
    descriptionIcon: string
    description: string
  }
  rootElements: MetamorphElementsRecord
}

export const config: MetamorphConfig = {
  style: {
    descriptionIcon: 'padding-right: 5px;',
    description: '',
  },
  rootElements: {
    beastShapeIV: {
      label: 'Forme Bestiale IV',
      type: 'group',
      elementChildren: {
        magicalBeastLarge: {
          label: 'Créature magique de taille G',
          type: 'group',
          elementChildren: {
            chimera: {
              label: 'Chimère',
              description:
                'Ce monstre ailé a le corps d’un lion et trois têtes : dragon, lion et chèvre. Pour connaitre la couleur de la tête de dragon, lancez [[/r 1d10 #Couleur de la tête de chimère]]. Si 1 ou 2 alors tête blanche, si 3 ou 4 alors tête bleue, si 5 ou 6 alors tête noire, si 7 ou 8 alors tête rouge, sinon si 9 ou 10 alors tête verte.',
              type: 'transformation',
              itemsToAdd: [
                {
                  name: 'Forme bestiale IV (créature magique G - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'buff',
                },
                {
                  name: 'Morsure (dragon) (chimère - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: 'Morsure (lion) (chimère - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: 'Corne (chèvre) (chimère - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: 'Corne (chèvre) (chimère - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: 'Souffle de Chimère (chimère - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'feat',
                },
              ],
              size: 'lg',
              stature: 'long',
              tokenTextureSrc: '/tokens/monsters/magicalBeasts/chimera.webp',
              actorImg: '/characters/monsters/magicalBeasts/chimera.webp',
              speed: {
                burrow: {
                  base: 0,
                },
                climb: {
                  base: 0,
                },
                fly: {
                  base: 50,
                  maneuverability: 'poor',
                },
                land: {
                  base: 30,
                },
                swim: {
                  base: 0,
                },
              },
              senses: {
                dv: 60,
                ll: {
                  enabled: true,
                  multiplier: {
                    bright: 2,
                    dim: 2,
                  },
                },
                sc: 30,
              },
            },
            gorgon: {
              label: 'Gorgone',
              description: 'Taureau de pierre qui peut pétrifier ses victimes',
              type: 'transformation',
              itemsToAdd: [
                {
                  name: 'Forme bestiale IV (créature magique G - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'buff',
                },
                {
                  name: 'Corne (gorgone - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: '2 sabots (gorgone - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'attack',
                },
                {
                  name: 'Piétinement',
                  compendiumName: 'world.aptitudes-de-classe-personnalisees',
                  type: 'feat',
                },
                {
                  name: 'Souffle de Gorgone (gorgone - metamorph)',
                  compendiumName: 'world.effets-metamorph',
                  type: 'feat',
                },
              ],
              size: 'lg',
              stature: 'long',
              tokenTextureSrc:
                '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
              actorImg: '/characters/monsters/magicalBeasts/gorgone.webp',
              speed: {
                burrow: {
                  base: 0,
                },
                climb: {
                  base: 0,
                },
                fly: {
                  base: 0,
                },
                land: {
                  base: 30,
                },
                swim: {
                  base: 0,
                },
              },
              senses: {
                dv: 60,
                ll: {
                  enabled: true,
                  multiplier: {
                    bright: 2,
                    dim: 2,
                  },
                },
                sc: 30,
              },
            },
          },
        },
      },
    },
    lycanthropy: {
      label: 'Lycanthropie Mythique',
      type: 'group',
      elementChildren: {
        canine: {
          label: 'Canine',
          type: 'transformation',
          requirement: {
            type: 'hasItem',
            item: {
              name: 'Lycanthrope mythique - Canine',
              type: 'feat',
            },
          },
          itemsToAdd: [
            {
              name: 'Lycanthrope mythique - Canine - Forme Hybride (metamorph)',
              compendiumName: 'world.effets-metamorph',
              type: 'feat',
            },
            {
              name: 'Morsure (lycanthropie mythique - canine - metamorph)',
              compendiumName: 'world.effets-metamorph',
              type: 'attack',
            },
            {
              name: '2 Griffes (lycanthropie mythique - canine - metamorph)',
              compendiumName: 'world.effets-metamorph',
              type: 'attack',
            },
          ],
          itemsToModify: [
            {
              name: 'Lycanthrope mythique - Canine - Forme Humanoïde',
              type: 'feat',
              action: 'disable',
            },
          ],
          size: 'lg',
          stature: 'tall',
          tokenTextureSrc: '/tokens/monsters/monstrousHumanoids/Werewolf.webp',
          actorImg: '/characters/PC/Seioden%20Loup%20Garou.jpg',
          speed: {
            burrow: {
              base: 0,
            },
            climb: {
              base: 0,
            },
            fly: {
              base: 0,
            },
            land: {
              base: 45,
            },
            swim: {
              base: 0,
            },
          },
          senses: {
            dv: 60,
            ll: {
              enabled: true,
              multiplier: {
                bright: 2,
                dim: 2,
              },
            },
            sc: 30,
          },
          ownershipChanges: 'clampAccessToLimited',
        },
      },
    },
    reducePerson: {
      label: 'Rapetissement',
      description: 'Effectif uniquement sur les humanoids',
      type: 'transformation',
      requirement: {
        type: 'equality',
        path: 'system.traits.humanoid',
        value: true,
      },
      itemsToAdd: [
        {
          name: 'Rapetissement (metamorph)',
          compendiumName: 'world.effets-metamorph',
          type: 'buff',
        },
      ],
      size: 'sm',
    },
  },
}
