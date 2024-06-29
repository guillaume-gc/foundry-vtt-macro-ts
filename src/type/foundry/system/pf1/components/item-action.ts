import { RecursivePartial } from '../../../utils/partial'

export interface ItemActionData {
  save: {
    dc: number
    description: string
    type: string
  }
}

export interface ItemActionAttributes {
  data: ItemActionData
}

export declare class ItemAction implements ItemActionAttributes {
  data: ItemActionData

  update: (updateData: RecursivePartial<ItemActionData>) => Promise<ItemAction>
}
