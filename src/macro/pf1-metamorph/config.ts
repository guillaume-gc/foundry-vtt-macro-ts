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

export interface MetamorphTransformationItem {
  name: string
  compendiumName: string
  type: ItemPFType
}

export interface MetamorphTransformation {
  label: string
  items: MetamorphTransformationItem[]
  size?: ActorPFSize
  stature?: ActorPFStature
  speed?: RecursivePartial<ActorPFSpeed>
  tokenTexture?: string
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
      items: [
        {
          name: 'Rapetissement (métamorphe)',
          compendiumName: 'world.effets-metamorph',
          type: 'buff',
        },
      ],
      size: 'sm',
    },
    gorgonBeastShapeIV: {
      label: 'Gorgone (Forme Bestiale IV)',
      items: [
        {
          name: 'Forme bestiale IV (créature magique G - métamorphe)',
          compendiumName: 'world.effets-metamorph',
          type: 'buff',
        },
        {
          name: 'Corne (gorgone - métamorphe)',
          compendiumName: 'world.effets-metamorph',
          type: 'attack',
        },
      ],
      size: 'lg',
      stature: 'long',
      tokenTexture: '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
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
