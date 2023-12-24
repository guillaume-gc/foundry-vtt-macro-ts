import { EmbeddedCollection } from '../../../../abstract/embedded-collection'
import { GetRollDataOptions } from '../../../../foundry'
import { PFRollDataAbility, PFRollDataSkill } from '../../pf1'
import { ItemPF } from '../item/item-pf'
import { ActorBasePf } from './actor-base-pf'

export type ActorSize =
  | 'fine'
  | 'dim'
  | 'tiny'
  | 'sm'
  | 'med'
  | 'lg'
  | 'huge'
  | 'grg'
  | 'col'

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
  }
  skills: {
    sen: PFRollDataSkill
  }
  traits: {
    eres: ActorPFEnergyResistance
    size: ActorSize
    di: ActorPFCustomizableValue<string[]>
    cres: string
    ci: ActorPFCustomizableValue<string[]>
    dv: ActorPFCustomizableValue<string[]>
    dr: ActorPFDamageReduction
    senses: ActorPFSenses
  }
}

export interface ActorPFDetails {}

export declare class ActorPF extends ActorBasePf {
  name: string

  getRollData: (options: GetRollDataOptions) => ActorPFRollData

  system: ActorPFRollData

  details: ActorPFDetails

  items: EmbeddedCollection<ItemPF>
}
