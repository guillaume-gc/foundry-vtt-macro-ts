import { UserWarning } from '../../common/error/user-warning'
import { getLoggerInstance } from '../../common/log/logger'
import { Document } from '../../type/foundry/abstract/document'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { ItemAction } from '../../type/foundry/system/pf1/components/item-action'
import {
  ActorPF,
  ActorPFCustomizableValue,
  ActorPFReduction,
  ResistedDamageType,
  ResistedEnergyType,
} from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPF } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { Collection } from '../../type/foundry/utils/collection'
import { MetamorphTransformation, MetamorphTransformationItem } from './config'
import {
  createItemInActor,
  findItemInActor,
  findItemInCompendium,
} from './item'
import {
  MetamorphActorData,
  MetamorphSave,
  MetamorphTokenDocumentData,
  transformToMetamorphSave,
} from './save'

const logger = getLoggerInstance()

/*
 * Add to the actor all necessary items for its transformation.
 */
const addTransformationItemToActor = async (
  actor: ActorPF,
  item: MetamorphTransformationItem,
  metamorphTransformSpellLevel?: number,
  metamorphSpellDifficultyCheck?: number,
) => {
  logger.debug('Prepare to add item to actor', item)

  const compendiumItem = await findItemInCompendium(
    item.compendiumName,
    item.name,
    item.type,
  )

  if (compendiumItem === undefined) {
    throw new Error(
      `Could not find buff ${item.name} (type ${item.type}) in compendium ${item.compendiumName}`,
    )
  }

  logger.debug('Found item in compendium', {
    compendiumItem,
    itemCompendiumName: item.compendiumName,
    itemName: item.name,
  })

  const actorItem = await createItemInActor(actor, compendiumItem)

  return updateAddedTransformationItem(
    actorItem,
    metamorphTransformSpellLevel,
    metamorphSpellDifficultyCheck,
  )
}

/*
 * Update the added item, if necessary.
 */
const updateAddedTransformationItem = async (
  item: ItemPF,
  metamorphTransformSpellLevel?: number,
  metamorphSpellDifficultyCheck?: number,
): Promise<(Document | ItemAction[])[] | Document> => {
  const updates: (Promise<Document> | Promise<ItemAction[]>)[] = []

  if (item.type === 'buff') {
    updates.push(
      item.update({
        system: {
          level: metamorphTransformSpellLevel,
          active: true,
        },
      }),
    )
  }

  // Update actions, if present within the item.
  if (item.hasAction) {
    updates.push(
      updateAddedTransformationItemActions(
        item.actions,
        metamorphSpellDifficultyCheck,
      ),
    )
  }

  if (updates.length > 0) {
    return Promise.all(updates)
  }

  return item
}

const updateAddedTransformationItemActions = async (
  actions: Collection<ItemAction>,
  metamorphSpellDifficultyCheck?: number,
) =>
  actions.map((action) =>
    action.update({
      save: {
        // Abilities DC must be using spell DC, if specified.
        dc: metamorphSpellDifficultyCheck?.toString(),
      },
    }),
  )

const mixReduction = <
  ReductionType extends [string, string] = [string, string],
>(
  actorReduction: ActorPFCustomizableValue<ActorPFReduction<ReductionType>[]>,
  polymorphReduction?: ActorPFCustomizableValue<
    ActorPFReduction<ReductionType>[]
  >,
): ActorPFCustomizableValue<ActorPFReduction<ReductionType>[]> =>
  polymorphReduction !== undefined
    ? {
        custom: [actorReduction.custom, polymorphReduction.custom]
          // Remove empty strings
          .filter((value) => value)
          .join(';'),
        value: [...actorReduction.value, ...polymorphReduction.value],
      }
    : actorReduction

/*
 * Apply polymorph to an actor and its token.
 */
export const applyMetamorph = async (
  tokens: TokenPF[],
  metamorphTransform: MetamorphTransformation,
  metamorphTransformSpellLevel?: number,
  metamorphSpellDifficultyCheck?: number,
) => {
  logger.info('Apply metamorph')

  const { tokenTexture, items } = metamorphTransform

  const itemActions = tokens.map(async ({ actor }) => {
    logger.debug('Create metamorph items in actor', actor)

    const individualItemActions = items.map((item) =>
      addTransformationItemToActor(
        actor,
        item,
        metamorphTransformSpellLevel,
        metamorphSpellDifficultyCheck,
      ),
    )

    return Promise.all(individualItemActions)
  })

  const actorsActions = tokens.map(async ({ actor }) => {
    logger.debug('Apply metamorph to actor', actor)

    return actor.update({
      system: {
        attributes: {
          speed: metamorphTransform.speed,
        },
        traits: {
          size: metamorphTransform.size,
          stature: metamorphTransform.stature,
          senses: {
            ...actor.system.traits.senses,
            ...metamorphTransform.senses,
          },
          dr: mixReduction<[ResistedDamageType, ResistedDamageType]>(
            actor.system.traits.dr,
            metamorphTransform.damageReduction,
          ),
          eres: mixReduction<[ResistedEnergyType, ResistedEnergyType]>(
            actor.system.traits.eres,
            metamorphTransform.energyResistance,
          ),
        },
      },
      flags: {
        metamorph: {
          ...actor.flags?.metamorph,
          active: true,
        },
      },
      prototypeToken: {
        texture: {
          src: tokenTexture,
        },
      },
    })
  })

  const tokensActions = tokens.map(async (token) => {
    logger.debug('Apply metamorph to token', token)

    return token.document.update({
      texture: {
        src: tokenTexture,
      },
    })
  })

  const applyActions = [...itemActions, ...actorsActions, ...tokensActions]

  await Promise.all(applyActions)
}

/*
 * Check if those tokens are valid for applying metamorph.
 */
export const checkTokens = (tokens: TokenPF[]) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning('Au moins un token a déjà un effet')
    }
  }
}

/*
 * Save polymorph data to actor flags.
 */
export const savePolymorphData = async (
  tokens: TokenPF[],
  metamorphTransform: MetamorphTransformation,
) => {
  logger.info('Save data to actor flags to ensure rolling back is possible')

  const operations = tokens.map(async (token) => {
    logger.debug('Save data related to a token', token)

    const actorData: MetamorphActorData = {
      system: {
        attributes: {
          speed: token.actor.system.attributes.speed,
        },
        traits: {
          size: token.actor.system.traits.size,
          stature: token.actor.system.traits.stature,
          senses: token.actor.system.traits.senses,
          dr: token.actor.system.traits.dr,
          eres: token.actor.system.traits.eres,
        },
      },
      prototypeToken: {
        texture: {
          src: token.document.texture.src,
        },
      },
    }
    const tokenDocumentData: MetamorphTokenDocumentData = {
      texture: {
        src: token.document.texture.src,
      },
    }

    const save: MetamorphSave = {
      actorData,
      tokenDocumentData,
      transformItemsData: metamorphTransform.items,
    }

    await token.actor.update({
      flags: {
        metamorph: {
          save,
        },
      },
    })
  })

  await Promise.all(operations)
}

/*
 * Rollback to pre-polymorph data using actor flags.
 */
export const rollbackToPrePolymorphData = async (tokens: TokenPF[]) => {
  logger.info('Prepare to roll back to data before polymorph was triggered')

  const rollbackActions: (Promise<Document> | Promise<Document[]>)[] = tokens
    .map((token) => {
      logger.debug('Rolling back token', token)

      const save = transformToMetamorphSave(token.actor.flags?.metamorph?.save)

      logger.debug('Save obtained from token actor', save)

      const currentRollBackActions: (
        | Promise<Document>
        | Promise<Document[]>
      )[] = [
        token.document.update(save.tokenDocumentData),
        token.actor.update({
          ...save.actorData,
          flags: {
            metamorph: {
              ...token.actor.flags?.metamorph,
              active: false,
            },
          },
        }),
      ]

      logger.debug('Delete all metamorph related items', save)

      const itemsToDelete = save.transformItemsData.reduce<ItemPF[]>(
        (previousItems, currentItem) => {
          const actorItem = findItemInActor(
            token.actor,
            currentItem.name,
            currentItem.type,
          )

          if (actorItem !== undefined) {
            previousItems.push(actorItem)
          } else {
            logger.warn(`Could not find ${currentItem.name} item in actor`)
          }

          return previousItems
        },
        [],
      )

      logger.debug(`Ready to delete ${itemsToDelete.length} items`, {
        itemsToDelete,
      })

      currentRollBackActions.push(
        token.actor.deleteEmbeddedDocuments(
          'Item',
          itemsToDelete.map(({ id }) => id),
        ),
      )

      return currentRollBackActions
    })
    .flat()

  logger.info('Trigger rollback')

  await Promise.all(rollbackActions)

  logger.info('Rollback complete')
}
