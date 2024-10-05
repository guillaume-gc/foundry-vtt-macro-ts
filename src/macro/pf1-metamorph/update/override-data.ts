import { TokenPF } from '../../../type/foundry/system/pf1/canvas/token-pf'
import {
  ActorPF,
  ActorPFCustomizableValue,
  ActorPFReduction,
  ResistedDamageType,
  ResistedEnergyType,
} from '../../../type/foundry/system/pf1/documents/actor/actor-pf'
import { TokenDocumentPF } from '../../../type/foundry/system/pf1/documents/token-document-pf'
import { MetamorphElementTransformation } from '../config'
import { createOwnershipChanges } from '../ownership'

export const createOverrideTokenDataUpdates = (
  token: TokenPF,
  metamorphElementTransformation: MetamorphElementTransformation,
): Promise<TokenDocumentPF> =>
  token.document.update({
    texture: {
      src: metamorphElementTransformation.tokenTextureSrc,
    },
  })

export const createOverrideActorDataUpdates = (
  actor: ActorPF,
  metamorphElementTransformation: MetamorphElementTransformation,
): Promise<ActorPF> =>
  actor.update({
    system: {
      attributes: {
        speed: metamorphElementTransformation.speed,
      },
      details: {
        biography: {
          value: metamorphElementTransformation.biography,
        },
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
        src: metamorphElementTransformation.tokenTextureSrc,
      },
    },
    img: metamorphElementTransformation.actorImg,
    ownership: createOwnershipChanges(
      actor,
      metamorphElementTransformation.ownershipChanges,
    ),
  })

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
