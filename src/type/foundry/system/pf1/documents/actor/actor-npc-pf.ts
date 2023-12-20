import { ActorPFDetails } from './actor-pf'

export declare class ActorNPCPF {
  details: ActorPFDetails & {
    cr: {
      total: number
    }
    xp: {
      value: number
    }
  }
}
