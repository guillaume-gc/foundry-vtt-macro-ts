import { getLoggerInstance } from '../../common/log/logger'

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

export interface MetamorphBuffData {
  name: string
}

export interface MetamorphSave {
  actorData: MetamorphActorData
  tokenDocumentData: MetamorphTokenDocumentData
  buffData: MetamorphBuffData
}

const logger = getLoggerInstance()

export const transformToMetamorphSaveIfValid = (
  value: Record<string, any> | undefined,
): MetamorphSave | undefined => {
  logger.debug('Transform flags to metamorph if they are valid', value)

  if (value === undefined) {
    return undefined
  }

  const {
    actorData: {
      system: { traits: { size: actorSize = undefined } = {} } = {},
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = undefined } = {},
    } = {},
    buffData: { name: buffName = undefined } = {},
  } = value

  logger.debug('Extracted values in flags', {
    actorSize,
    tokenTextureSrc,
    buffName,
  })

  if (
    actorSize === undefined ||
    tokenTextureSrc === undefined ||
    buffName === undefined
  ) {
    return undefined
  }

  return value as MetamorphSave
}
