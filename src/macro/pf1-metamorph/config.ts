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

export interface MetamorphTransformationGroup {
  label: string
  description?: string
  transformation: Record<string, MetamorphTransformation>
}

export interface MetamorphTransformation {
  label: string
  description?: string
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
}

export interface MetamorphConfig {
  style: {
    descriptionIcon: string
    description: string
  }
  transformationGroups: Record<string, MetamorphTransformationGroup>
}

export const config: MetamorphConfig = {
  style: {
    descriptionIcon: 'padding-right: 5px;',
    description: '',
  },
  transformationGroups: {
    beastShape: {
      label: 'Forme Bestiale (créature magique de taille G)',
      description: 'Disponible à partir de Forme Bestiale IV',
      transformation: {
        chimeraBestShapeIV: {
          label: 'Chimère',
          description:
            'Ce monstre ailé a le corps d’un lion et trois têtes : une de dragon et une de chèvre cornue. Pour connaitre la couleur de la tête, lancez [[/r 1d10 #Couleur de la tête de chimère]]. Si 1 ou 2 alors tête blanche, si 4 ou 4 alors tête bleue, si 5 ou 6 alors tête noire, si 7 ou 8 alors tête rouge, sinon tête verte.',
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
        gorgonBeastShapeIV: {
          label: 'Gorgone',
          description: 'Taureau de pierre qui peut pétrifier ses victimes',
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
    simpleSpell: {
      label: 'Sort simple',
      transformation: {
        reducePerson: {
          label: 'Rapetissement',
          description: 'Effectif uniquement sur les humanoids',
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
    },
  },
}
