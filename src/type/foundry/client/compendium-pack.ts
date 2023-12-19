import { Collection } from '../utils/collection'
import { Compendium } from './compendium'
import { CompendiumCollection } from './compendium-collection'

// According to Foundry document, it does not seem
export declare class CompendiumPack extends Collection<
  CompendiumCollection<Compendium>
> {
  constructor()
}
