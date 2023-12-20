import { Document } from '../abstract/document'
import { Collection } from '../utils/collection'
import { CompendiumCollection } from './compendium-collection'

// According to Foundry document.ts, it does not seem
export declare class CompendiumPack<T extends Document> extends Collection<
  CompendiumCollection<T>
> {
  constructor()
}
