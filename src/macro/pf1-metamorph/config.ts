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

export interface MetamorphTransformation {
  label: string
  itemsToAdd: MetamorphTransformationCompendiumItem[]
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
  transformations: Record<string, MetamorphTransformation>
}

export const config: MetamorphConfig = {
  transformations: {
    reducePerson: {
      label: 'Rapetissement',
      itemsToAdd: [
        {
          name: 'Rapetissement (metamorph)',
          compendiumName: 'world.effets-metamorph',
          type: 'buff',
        },
      ],
      size: 'sm',
    },
    gorgonBeastShapeIV: {
      label: 'Gorgone (Forme Bestiale IV)',
      itemsToModify: [
        {
          name: 'New Effet',
          type: 'buff',
          action: 'disable',
        },
      ],
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
      tokenTextureSrc: '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
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
}
