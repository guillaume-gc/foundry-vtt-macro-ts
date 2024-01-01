import { Document } from '../abstract/document'
import { Collection } from '../utils/collection'
import { CompendiumCollection } from './compendium-collection'

// According to Foundry document.ts, it does not seem
export declare class CompendiumPack<
  MinimalIndex,
  CollectionData extends Document,
> extends Collection<CompendiumCollection<MinimalIndex, CollectionData>> {
  constructor()
}
