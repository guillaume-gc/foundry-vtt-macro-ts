import { Collection } from '../utils/collection'
import { DataModel } from './data-model'

export declare class EmbeddedCollection<
  ContainedData,
> extends Collection<ContainedData> {
  constructor(name: string, parent: DataModel, sourceArray: ContainedData[])
}
