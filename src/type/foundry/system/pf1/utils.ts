import { DocumentType } from '../../abstract/document'
import { CompendiumCollection } from '../../client/compendium-collection'
import { PacksMinimalIndexPF } from './documents/minimal-index-pf'

export interface PF1Utils {
  findInCompendia: <T = Document>(
    searchTerm: string,
    options: {
      packs?: string[]
      type?: DocumentType
    },
  ) =>
    | { pack: CompendiumCollection<PacksMinimalIndexPF, T>; index: any }
    | undefined
}
