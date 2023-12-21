import { DataModel } from './data-model'

interface DocumentModificationContext {
  /**
   * A parent Document within which these Documents should be embedded
   */
  parent?: Document

  /**
   * A Compendium pack identifier within which the Documents should be modified
   */
  pack?: string

  /**
   * Block the dispatch of preCreate hooks for this operation
   * @defaultValue `false`
   */
  noHook?: boolean

  /**
   * Return an index of the Document collection, used only during a get operation.
   * @defaultValue `false`
   */
  index?: boolean

  /**
   * An array of fields to retrieve when indexing the collection
   */
  indexFields?: string[]

  /**
   * When performing a creation operation, keep the provided _id instead of clearing it.
   * @defaultValue `false`
   */
  keepId?: boolean

  /**
   * When performing a creation operation, keep existing _id values of documents embedded within the one being created instead of generating new ones.
   * @defaultValue `true`
   */
  keepEmbeddedIds?: boolean

  /**
   * Create a temporary document which is not saved to the database. Only used during creation.
   * @defaultValue `false`
   */
  temporary?: boolean

  /**
   * Automatically re-render existing applications associated with the document.
   * @defaultValue `true`
   */
  render?: boolean

  /**
   * Automatically create and render the Document sheet when the Document is first created.
   * @defaultValue `false`
   */
  renderSheet?: boolean

  /**
   * Difference each update object against current Document data to reduce the size of the transferred data. Only used during update.
   * @defaultValue `true`
   */
  diff?: boolean

  /**
   * Merge objects recursively. If false, inner objects will be replaced explicitly. Use with caution!
   * @defaultValue `true`
   */
  recursive?: boolean

  /**
   * Is the operation undoing a previous operation, only used by embedded Documents within a Scene
   */
  isUndo?: boolean

  /**
   * Whether to delete all documents of a given type, regardless of the array of ids provided. Only used during a delete operation.
   */
  deleteAll?: boolean
}

export declare class Document extends DataModel {
  constructor()

  update(
    data?: Record<string, any>,
    context?: DocumentModificationContext,
  ): Promise<Document>

  deleteEmbeddedDocuments(
    embeddedName: 'Item',
    ids: string[],
    context?: DocumentModificationContext,
  ): Promise<Document[]>

  id: string
}
