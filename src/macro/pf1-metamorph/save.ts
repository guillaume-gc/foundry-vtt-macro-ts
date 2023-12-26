import { getLoggerInstance } from '../../common/log/logger'
import {
  ActorPFDamageReduction,
  ActorPFEnergyResistance,
  ActorPFSenses,
  ActorPFSize,
  ActorPFSpeed,
  ActorPFStature,
} from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { MetamorphTransformationItem } from './config'

export interface MetamorphActorData {
  system: {
    attributes: {
      speed: ActorPFSpeed
    }
    traits: {
      size: ActorPFSize
      stature: ActorPFStature
      senses: ActorPFSenses
      dr: ActorPFDamageReduction
      eres: ActorPFEnergyResistance
    }
  }
  prototypeToken: MetamorphTokenDocumentData
  img: string
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

/*
 * Transform the value to MetamorphSave, if valid.
 *
 * To keep the function simple, it's just checking root attributes.
 */
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

  return value as MetamorphSave
}
