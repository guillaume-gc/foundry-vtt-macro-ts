import { DocumentModificationContext } from '../../../../foundry'
import { RecursivePartial } from '../../../../utils/partial'
import { ItemPF } from './item-pf'

export interface ItemFeatPFData {
  system: {
    disabled: boolean
  }
}

export declare class ItemFeatPF extends ItemPF implements ItemFeatPFData {
  type: 'feat'

  system: {
    disabled: boolean
  }

  update(
    data?: RecursivePartial<ItemFeatPFData>,
    context?: DocumentModificationContext,
  ): Promise<ItemFeatPF>
}
