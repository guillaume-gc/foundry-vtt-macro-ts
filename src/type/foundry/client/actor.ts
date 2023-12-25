import { EmbeddedCollection } from '../abstract/embedded-collection'
import { PrototypeToken } from '../data/prototype-token'
import { BaseActor } from '../documents/base-actor'
import { GetRollDataOptions } from '../foundry'
import { Item } from './item'

export interface ActorAttributes {
  flags?: Record<string, any>
  items: EmbeddedCollection<Item>
  prototypeToken: PrototypeToken
}

export declare class Actor extends BaseActor implements ActorAttributes {
  getRollData: (options: GetRollDataOptions) => Record<string, any>

  flags?: Record<string, any>
  items: EmbeddedCollection<Item>
  prototypeToken: PrototypeToken
}
