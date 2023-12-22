import { ActorSize } from '../../type/foundry/system/pf1/documents/actor/actor-pf'

export interface MetamorphTransformationDocument {
  name: string
  compendiumName: string
}

export interface MetamorphTransformation {
  label: string
  buff: MetamorphTransformationDocument
  abilities: MetamorphTransformationDocument[]
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
      buff: {
        name: 'Rapetissement (métamorphe)',
        compendiumName: 'world.effets-metamorph',
      },
      abilities: [],
      size: 'sm',
    },
    gorgonBeastShapeIV: {
      label: 'Gorgone (Forme Bestiale IV)',
      buff: {
        name: 'Forme bestiale IV (créature magique G - métamorphe)',
        compendiumName: 'world.effets-metamorph',
      },
      abilities: [],
      size: 'lg',
      tokenTexture: '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
    },
  },
}
