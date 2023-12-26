import { DocumentModificationContext } from '../../../../foundry'
import { RecursivePartial } from '../../../../utils/partial'
import { ItemPF } from './item-pf'

export interface ItemBuffPFData {
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
