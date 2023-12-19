import { Collection } from '../utils/collection'
import { DocumentCollection } from './document-collection'

export declare class CompendiumCollection<T> extends DocumentCollection<T> {
  constructor(metadata?: any)

  index: Collection<T>
}
