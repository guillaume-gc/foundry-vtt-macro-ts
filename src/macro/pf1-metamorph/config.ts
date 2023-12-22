import { ActorSize } from '../../type/foundry/system/pf1/documents/actor/actor-pf'

export interface MetamorphTransformationDocument {
  name: string
  compendium: string
}

export interface MetamorphTransformation {
  label: string
  buff: MetamorphTransformationDocument
  abilities: MetamorphTransformationDocument[]
  size: ActorSize
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
        name: 'Rapetissement',
        compendium: 'world.effets-metamorph',
      },
      abilities: [],
      size: 'sm',
    },
  },
}
