import { Collection } from '../utils/collection'
import { DocumentCollection } from './document-collection'

export declare class CompendiumCollection<
  MinimalIndex,
  CollectionData,
> extends DocumentCollection<CollectionData> {
  constructor(metadata?: any)

  getDocument<T = Document>(id: string): Promise<T>

  index: Collection<MinimalIndex>
}
