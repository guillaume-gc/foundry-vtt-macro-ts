export type DocumentOwnershipLevelRecord = Record<
  string,
  DocumentOwnershipLevel
>

export const enum DocumentOwnershipLevel {
  /**
   * The User inherits permissions from the parent Folder.
   */
  INHERIT = -1,

  /**
   * Restricts the associated Document so that it may not be seen by this User.
   */
  NONE = 0,

  /**
   * Allows the User to interact with the Document in basic ways, allowing them to see it in sidebars and see only limited aspects of its contents. The limits of this interaction are defined by the game system being used.
   */
  LIMITED = 1,

  /**
   * Allows the User to view this Document as if they were owner, but prevents them from making any changes to it.
   */
  OBSERVER = 2,

  /**
   * Allows the User to view and make changes to the Document as its owner. Owned documents cannot be deleted by anyone other than a gamemaster level User.
   */
  OWNER = 3,
}
