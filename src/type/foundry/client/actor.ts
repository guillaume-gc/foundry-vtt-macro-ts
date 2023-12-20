import { BaseActor } from '../documents/base-actor'
import { GetRollDataOptions } from '../foundry'

export declare class Actor extends BaseActor {
  getRollData: (options: GetRollDataOptions) => Record<string, any>
}
