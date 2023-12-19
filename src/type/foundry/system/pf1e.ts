import { GetRollDataOptions, Permission, User } from '../foundry'

interface ActorPFDetails {}

export interface PFRollDataAbility {
  mod: number
}

export interface PFRollDataSkill {
  rank: number
  mod: number
}

export interface PFRollData {
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

export interface ActorBasePF {
  name: string
  details: ActorPFDetails
  testUserPermission: (user: User, permission: Permission) => boolean
  getRollData: (options: GetRollDataOptions) => PFRollData
}

interface ActorNPCPF extends ActorBasePF {
  details: ActorPFDetails & {
    cr: {
      total: number
    }
    xp: {
      value: number
    }
  }
}

export type ActorPF = ActorBasePF | ActorNPCPF

export interface TokenPF {
  document: {
    name: string
    texture: {
      src: string
    }
    x: number
    y: number
  }
  id: string
  actor: ActorPF
}
