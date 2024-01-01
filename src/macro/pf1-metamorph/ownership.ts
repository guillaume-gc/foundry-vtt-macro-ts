import { getLoggerInstance } from '../../common/log/logger'
import {
  DocumentOwnershipLevel,
  DocumentOwnershipLevelRecord,
} from '../../type/foundry/const/document-ownership-level'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'

export type MetamorphOwnershipChanges = 'removeAccess' | 'clampAccessToLimited'

const logger = getLoggerInstance()

export const createOwnershipChanges = (
  actor: ActorPF,
  ownershipChanges: MetamorphOwnershipChanges | undefined,
): DocumentOwnershipLevelRecord | undefined => {
  logger.debug('Create ownership changes', {
    actor,
    ownershipChanges,
  })

  if (ownershipChanges === undefined) {
    return undefined
  }

  switch (ownershipChanges) {
    case 'removeAccess':
      return removeOwnershipAccess(actor.ownership)
    case 'clampAccessToLimited':
      return clampOwnershipToLevelThreshold(
        actor.ownership,
        DocumentOwnershipLevel.LIMITED,
      )
  }
}

const removeOwnershipAccess = (
  ownershipRecord: DocumentOwnershipLevelRecord,
) => {
  const newOwnership: DocumentOwnershipLevelRecord = {}

  for (const key of Object.keys(ownershipRecord)) {
    newOwnership[key] = DocumentOwnershipLevel.NONE
  }

  logger.debug('Remove ownership access ownership changes', {
    ownershipRecord,
    newOwnership,
  })

  return newOwnership
}

const clampOwnershipToLevelThreshold = (
  ownershipRecord: DocumentOwnershipLevelRecord,
  levelThreshold: DocumentOwnershipLevel,
) => {
  const newOwnership: DocumentOwnershipLevelRecord = {}

  for (const key of Object.keys(ownershipRecord)) {
    if (ownershipRecord[key] < levelThreshold) {
      newOwnership[key] = ownershipRecord[key]
      continue
    }

    newOwnership[key] = levelThreshold
  }

  logger.debug('Clamp ownership access level', {
    ownershipRecord,
    newOwnership,
    levelThreshold,
  })

  return newOwnership
}
