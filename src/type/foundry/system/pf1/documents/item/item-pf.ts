import { ActorPF } from '../../pf1'
import { ItemBuffPF } from './item-buff'

export type ItemPFType = 'buff'

export declare class ItemBasePF {
  constructor(...args: any[])

  type: ItemPFType

  name: string

  uuid: string

  get hasDamage(): boolean

  get isOwned(): boolean

  get isActive(): boolean

  get hasAction(): boolean

  get isSingleUse(): boolean

  get isCharged(): boolean

  get charges(): boolean

  get autoDeductCharges(): boolean

  get actor(): ActorPF

  get img(): string

  get thumbnail(): string

  getDefaultChargeCost(rollData: {}): number

  getRollData(): object
}

export declare type ItemPF = ItemBuffPF
