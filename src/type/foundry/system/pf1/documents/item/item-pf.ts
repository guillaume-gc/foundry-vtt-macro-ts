import { ActorPF } from '../actor/actor-pf'
import { ItemBasePF } from './item-base-pf'

export const itemPFTypeValues = ['buff', 'attack'] as const
export type ItemPFType = (typeof itemPFTypeValues)[number]

export declare class ItemPF extends ItemBasePF {
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
