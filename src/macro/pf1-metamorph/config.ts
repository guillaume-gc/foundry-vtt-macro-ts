import { ActorSize } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPFType } from '../../type/foundry/system/pf1/documents/item/item-pf'

export interface MetamorphTransformationItem {
  name: string
  compendiumName: string
  type: ItemPFType
}

export interface MetamorphTransformation {
  label: string
  items: MetamorphTransformationItem[]
  size?: ActorSize
  tokenTexture?: string
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
      tokenTexture: '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
    },
  },
}
