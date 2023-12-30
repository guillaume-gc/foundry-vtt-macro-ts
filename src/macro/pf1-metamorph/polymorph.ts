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
import { ItemBuffPF } from '../../type/foundry/system/pf1/documents/item/item-buff-pf'
import { ItemFeatPF } from '../../type/foundry/system/pf1/documents/item/item-feat-pf'
import { ItemPF } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { Collection } from '../../type/foundry/utils/collection'
import {
  MetamorphElementTransformation,
  MetamorphItemTransformationAction,
  MetamorphTransformationActorItem,
  MetamorphTransformationCompendiumItem,
} from './config'
import { createItemInActor, findItemInCompendium } from './item'

const logger = getLoggerInstance()

/*
 * Add to the actor all necessary items for its transformation.
 */
const addTransformationItemToActor = async (
  actor: ActorPF,
  item: MetamorphTransformationCompendiumItem,
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
      (item as ItemBuffPF).update({
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

/*
 * Update added items action.
 */
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

/*
 * Mix actor existing reduction (damage reduction and energy resistance) with those added by metamorph.
 */
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
  metamorphElementTransformation: MetamorphElementTransformation,
  metamorphTransformSpellLevel?: number,
  metamorphSpellDifficultyCheck?: number,
) => {
  logger.info('Apply metamorph')

  const { tokenTextureSrc, itemsToAdd, itemsToModify } =
    metamorphElementTransformation

  const updates: Promise<unknown>[][] = []

  updates.push(
    tokens.map(({ actor }) => {
      logger.debug('Apply metamorph to actor', actor)

      return actor.update({
        system: {
          attributes: {
            speed: metamorphElementTransformation.speed,
          },
          traits: {
            size: metamorphElementTransformation.size,
            stature: metamorphElementTransformation.stature,
            senses: {
              ...actor.system.traits.senses,
              ...metamorphElementTransformation.senses,
            },
            dr: mixReduction<[ResistedDamageType, ResistedDamageType]>(
              actor.system.traits.dr,
              metamorphElementTransformation.damageReduction,
            ),
            eres: mixReduction<[ResistedEnergyType, ResistedEnergyType]>(
              actor.system.traits.eres,
              metamorphElementTransformation.energyResistance,
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
            src: tokenTextureSrc,
          },
        },
        img: metamorphElementTransformation.actorImg,
      })
    }),
  )

  updates.push(
    tokens.map((token) => {
      logger.debug('Apply metamorph to token', token)

      return token.document.update({
        texture: {
          src: tokenTextureSrc,
        },
      })
    }),
  )

  if (itemsToAdd !== undefined) {
    updates.push(
      createItemToAddUpdates(
        tokens,
        itemsToAdd,
        metamorphTransformSpellLevel,
        metamorphSpellDifficultyCheck,
      ),
    )
  }

  if (itemsToModify !== undefined) {
    updates.push(getItemToModifyUpdate(tokens, itemsToModify))
  }

  await Promise.all(updates.flat())
}

export const createItemToAddUpdates = (
  tokens: TokenPF[],
  itemsToAdd: MetamorphTransformationCompendiumItem[],
  metamorphTransformSpellLevel: number | undefined,
  metamorphSpellDifficultyCheck: number | undefined,
) =>
  tokens.map(({ actor }) => {
    logger.debug('Create metamorph items in actor', actor)

    const individualItemUpdate: Promise<unknown>[] = itemsToAdd.map((item) =>
      addTransformationItemToActor(
        actor,
        item,
        metamorphTransformSpellLevel,
        metamorphSpellDifficultyCheck,
      ),
    )

    return Promise.all(individualItemUpdate)
  })

export const getItemToModifyUpdate = (
  tokens: TokenPF[],
  itemsToModify: MetamorphTransformationActorItem[],
) =>
  tokens
    .map(({ actor }) =>
      actor.items.reduce<Promise<unknown>[]>((accumulator, currentItem) => {
        const modification = itemsToModify.find(
          (item) =>
            item.name === currentItem.name && item.type === currentItem.type,
        )

        if (modification === undefined) {
          return accumulator
        }

        accumulator.push(
          getTransformActionUpdate(modification.action, currentItem),
        )

        return accumulator
      }, []),
    )
    .flat()

export const getTransformActionUpdate = (
  action: MetamorphItemTransformationAction,
  item: ItemPF,
): Promise<ItemPF> => {
  switch (action) {
    case 'disable':
      return getDisableActionUpdate(item)
  }
}

export const getDisableActionUpdate = (item: ItemPF): Promise<ItemPF> => {
  if (item.type === 'buff') {
    return (item as ItemBuffPF).update({
      system: {
        active: false,
      },
    })
  }
  if (item.type === 'feat') {
    return (item as ItemFeatPF).update({
      system: {
        disabled: true,
      },
    })
  }

  throw new Error(
    `Unexpected item type ${item.type}, cannot create disable action update`,
  )
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
