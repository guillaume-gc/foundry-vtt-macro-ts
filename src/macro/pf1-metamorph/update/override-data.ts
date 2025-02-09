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
      src: metamorphElementTransformation.token?.textureSrc,
      scaleX: metamorphElementTransformation.token?.scale,
      scaleY: metamorphElementTransformation.token?.scale,
    },
    name: metamorphElementTransformation.token?.name,
  })

export const createOverrideActorDataUpdates = (
  actor: ActorPF,
  metamorphElementTransformation: MetamorphElementTransformation,
): Promise<ActorPF> =>
  actor.update({
    name: metamorphElementTransformation.name ?? actor.name,
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
        src: metamorphElementTransformation.token?.textureSrc,
        scaleX: metamorphElementTransformation.token?.scale,
        scaleY: metamorphElementTransformation.token?.scale,
      },
      name: metamorphElementTransformation.token?.name,
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
  metamorphReduction?: ActorPFCustomizableValue<
    ActorPFReduction<ReductionType>[]
  >,
): ActorPFCustomizableValue<ActorPFReduction<ReductionType>[]> =>
  metamorphReduction !== undefined
    ? {
        custom: [actorReduction.custom, metamorphReduction.custom]
          // Remove empty strings
          .filter((value) => value)
          .join(';'),
        value: [...actorReduction.value, ...metamorphReduction.value],
      }
    : actorReduction
