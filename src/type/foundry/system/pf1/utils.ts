import { DocumentType } from '../../abstract/document'
import { CompendiumCollection } from '../../client/compendium-collection'

export interface PF1Utils {
  findInCompendia: (
    searchTerm: string,
    options: {
      packs?: string[]
      type?: DocumentType
    },
  ) => { pack: CompendiumCollection<Document>; index: Object } | undefined
}
