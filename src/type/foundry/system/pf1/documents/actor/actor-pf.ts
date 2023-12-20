import { EmbeddedCollection } from '../../../../abstract/embedded-collection'
import { GetRollDataOptions } from '../../../../foundry'
import { PFRollDataAbility, PFRollDataSkill } from '../../pf1'
import { ItemPF } from '../item/item-pf'
import { ActorBasePf } from './actor-base-pf'

export type ActorSize = 'med' | 'huge'

export interface PFActorRollData {
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
    eres: string
    size: ActorSize
    di: {
      value: string[]
      custom: string
    }
    cres: string
    ci: {
      value: string[]
      custom: string
    }
    dv: {
      value: string[]
      custom: string
    }
  }
}

export interface ActorPFDetails {}

export declare class ActorPF extends ActorBasePf {
  name: string

  getRollData: (options: GetRollDataOptions) => PFActorRollData

  system: PFActorRollData

  details: ActorPFDetails

  items: EmbeddedCollection<ItemPF>
}
