import { EmbeddedCollection } from '../../../../abstract/embedded-collection'
import { ActorAttributes } from '../../../../client/actor'
import {
  DocumentModificationContext,
  GetRollDataOptions,
} from '../../../../foundry'
import { RecursivePartial } from '../../../../utils/partial'
import { PFRollDataAbility, PFRollDataSkill } from '../../pf1'
import { ItemPF } from '../item/item-pf'
import { ActorBasePf } from './actor-base-pf'

export type ActorPFSize =
  | 'fine'
  | 'dim'
  | 'tiny'
  | 'sm'
  | 'med'
  | 'lg'
  | 'huge'
  | 'grg'
  | 'col'

export type ActorPFStature = 'tall' | 'long'

export interface ActorPFSenses {
  // Blindsight (in feet)
  bs: number

  // Blindsense (in feet).
  bse: number

  custom: string

  // Light low vision.
  ll: {
    enabled: boolean
    multiplier: {
      bright: number
      dim: number
    }
  }

  // Dark vision (in feet).
  dv: number

  // Scent (in feet).
  sc: number

  // See invisibility.
  si: boolean

  // See in darkness.
  sid: boolean

  // True Seeing.
  tr: boolean

  // Tremorsense.
  ts: number
}

export type ActorPFFlyManeuverability =
  | 'clumsy'
  | 'poor'
  | 'average'
  | 'good'
  | 'perfect'

export interface ActorPFSpeed {
  burrow: {
    base: number
    total: number
  }
  climb: {
    base: number
    total: number
  }
  fly: {
    base: number

    // Default is "average"
    maneuverability: ActorPFFlyManeuverability

    total: number
  }
  land: {
    base: number
    total: number
  }
  swim: {
    base: number
    total: number
  }
}

export type ResistedEnergyType =
  | ''
  | 'fire'
  | 'cold'
  | 'electric'
  | 'acid'
  | 'sonic'
  | 'force'
  | 'negative'
  | 'positive'
export type ResistedDamageType = '' | 'slashing' | 'piercing' | 'bludgeoning'

export interface ActorPFReduction<
  ReductionType extends [string, string] = [string, string],
> {
  amount: number
  operator: boolean
  types: ReductionType
}

export interface ActorPFCustomizableValue<
  ExpectedValueType,
  CustomValueType = string,
> {
  value: ExpectedValueType
  custom: CustomValueType
}

export type ActorPFEnergyResistance = ActorPFCustomizableValue<
  ActorPFReduction<[ResistedEnergyType, ResistedEnergyType]>[]
>
export type ActorPFDamageReduction = ActorPFCustomizableValue<
  ActorPFReduction<[ResistedDamageType, ResistedDamageType]>[]
>

export interface ActorPFRollData {
  abilities: {
    str: PFRollDataAbility
    dex: PFRollDataAbility
    con: PFRollDataAbility
    int: PFRollDataAbility
    wis: PFRollDataAbility
    cha: PFRollDataAbility
  }
  details: ActorPFDetails
  attributes: {
    hd: {
      total: string
    }
    ac: {
      normal: {
        total: number
      }
      flatFooted: {
        total: number
      }
      touch: {
        total: number
      }
    }
    cmd: {
      flatFootedTotal: number
      total: number
    }
    bab: {
      total: number
    }
    sr: {
      total: number
    }
    speed: ActorPFSpeed
  }
  skills: {
    sen: PFRollDataSkill
  }
  traits: {
    eres: ActorPFEnergyResistance
    size: {
      base: ActorPFSize
      value: number
    }
    stature: ActorPFStature
    di: ActorPFCustomizableValue<string[]>
    cres: string
    ci: ActorPFCustomizableValue<string[]>
    dv: ActorPFCustomizableValue<string[]>
    dr: ActorPFDamageReduction
    senses: ActorPFSenses
    humanoid: boolean
    fastHealing: string
    regen: string
  }
}

export interface ActorPFRollDataUpdate extends Omit<ActorPFRollData, 'traits'> {
  traits: {
    eres: ActorPFEnergyResistance
    size: ActorPFSize
    stature: ActorPFStature
    di: ActorPFCustomizableValue<string[]>
    cres: string
    ci: ActorPFCustomizableValue<string[]>
  }
}

export interface ActorPFDetails {
  biography: {
    value: string
  }
}

interface ActorPFAttributes extends ActorAttributes {
  name: string
  system: ActorPFRollData
  items: EmbeddedCollection<ItemPF>
  img: string
}

interface ActorPFAttributesUpdate extends Omit<ActorPFAttributes, 'system'> {
  name: string
  system: ActorPFRollDataUpdate
  items: EmbeddedCollection<ItemPF>
  img: string
}

export declare class ActorPF extends ActorBasePf implements ActorPFAttributes {
  name: string
  system: ActorPFRollData
  details: ActorPFDetails
  items: EmbeddedCollection<ItemPF>
  img: string

  getRollData: (options: GetRollDataOptions) => ActorPFRollData

  update(
    data?: RecursivePartial<ActorPFAttributesUpdate>,
    context?: DocumentModificationContext,
  ): Promise<ActorPF>
}
