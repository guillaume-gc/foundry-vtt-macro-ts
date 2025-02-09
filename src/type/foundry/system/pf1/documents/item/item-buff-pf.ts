import { DocumentModificationContext } from '../../../../foundry'
import { RecursivePartial } from '../../../../utils/partial'
import { ActorPF } from '../actor/actor-pf'
import { ItemPF } from './item-pf'

export interface ItemBuffPFData {
  type: 'buff'

  actor: ActorPF

  system: {
    level?: number
    active: boolean
  }
}

export declare class ItemBuffPF extends ItemPF implements ItemBuffPFData {
  type: 'buff'

  system: {
    level?: number
    active: true
  }

  update(
    data?: RecursivePartial<ItemBuffPFData>,
    context?: DocumentModificationContext,
  ): Promise<ItemBuffPF>
}
