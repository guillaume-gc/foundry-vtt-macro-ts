import { UserWarning } from '../../common/error/user-warning'
import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPF } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { TokenDocumentPF } from '../../type/foundry/system/pf1/documents/token-document-pf'
import { MetamorphElementTransformation } from './config'
import { checkFilter } from './filter'
import { createAddItemsUpdates } from './update/add-item'
import { createModifyActorItemUpdates } from './update/modify-item'
import {
  createOverrideActorDataUpdates,
  createOverrideTokenDataUpdates,
} from './update/override-data'

export interface MetamorphOptions {
  metamorphTransformSpellLevel?: number
  metamorphSpellDifficultyCheck?: number
}

const logger = getLoggerInstance()

type UpdateData = ActorPF | TokenDocumentPF | Document | ItemPF
type MetamorphUpdates = Promise<UpdateData[] | UpdateData>[]

/*
 * Apply metamorph to an actor and its token.
 */
export const applyMetamorph = async (
  tokens: TokenPF[],
  metamorphElementTransformation: MetamorphElementTransformation,
  options: MetamorphOptions,
) => {
  logger.info('Apply metamorph')

  await Promise.all(
    createMetamorphUpdate(tokens, metamorphElementTransformation, options),
  )
}

const createMetamorphUpdate = (
  tokens: TokenPF[],
  metamorphElementTransformation: MetamorphElementTransformation,
  options: MetamorphOptions,
): MetamorphUpdates =>
  tokens
    .map((token) => {
      const tokenUpdates: MetamorphUpdates = []

      tokenUpdates.push(
        createOverrideActorDataUpdates(
          token.actor,
          metamorphElementTransformation,
        ),
        createOverrideTokenDataUpdates(token, metamorphElementTransformation),
      )

      if (metamorphElementTransformation.items?.toAdd !== undefined) {
        tokenUpdates.push(
          createAddItemsUpdates(
            token.actor,
            metamorphElementTransformation.items.toAdd,
            options,
          ),
        )
      }

      if (metamorphElementTransformation.items?.toModify !== undefined) {
        tokenUpdates.push(
          createModifyActorItemUpdates(
            token.actor.items,
            metamorphElementTransformation.items.toModify,
          ),
        )
      }

      return tokenUpdates
    })
    .flat()

/*
 * Check if those tokens are valid for applying metamorph.
 */
export const checkTokens = (
  tokens: TokenPF[],
  elementTransformation: MetamorphElementTransformation,
) => {
  for (const token of tokens) {
    const { requirement } = elementTransformation

    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning('Au moins un token a déjà un effet')
    }

    if (requirement !== undefined && !checkFilter(token.actor, requirement)) {
      throw new UserWarning(
        "Au moins un token n'est pas compatible avec l'effet",
      )
    }
  }
}
