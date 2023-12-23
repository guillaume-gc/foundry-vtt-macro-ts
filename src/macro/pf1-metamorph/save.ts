import { getLoggerInstance } from '../../common/log/logger'
import { itemPFTypeValues } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { MetamorphTransformationItem } from './config'

export interface MetamorphActorData {
  system: {
    traits: {
      size: string
    }
  }
}

export interface MetamorphTokenDocumentData {
  texture: {
    src: string
  }
}

export interface MetamorphSave {
  actorData: MetamorphActorData
  tokenDocumentData: MetamorphTokenDocumentData
  transformItemsData: MetamorphTransformationItem[]
}

const logger = getLoggerInstance()

export const transformToMetamorphSave = (
  value: Record<string, any> | undefined,
): MetamorphSave => {
  logger.debug('Transform flags to metamorph if they are valid', value)

  if (value === undefined) {
    throw new Error('Flag values are undefined')
  }

  const {
    actorData: {
      system: { traits: { size: actorSize = undefined } = {} } = {},
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = undefined } = {},
    } = {},
    transformItemsData,
  } = value

  logger.debug('Extracted values in flags', {
    actorSize,
    tokenTextureSrc,
    transformItemsData,
  })

  if (
    actorSize === undefined ||
    tokenTextureSrc === undefined ||
    transformItemsData === undefined
  ) {
    throw new Error('Flag values are invalid')
  }

  for (const { name, compendiumName, type } of transformItemsData) {
    if (
      name === undefined ||
      compendiumName === undefined ||
      type === undefined
    ) {
      throw new Error('Flag transformItemsData is invalid')
    }

    if (!itemPFTypeValues.includes(type)) {
      throw new Error('Type in transformItemsData flag is invalid')
    }
  }

  return value as MetamorphSave
}
