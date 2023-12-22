import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import {
  getInputElement,
  getSelectElementValue,
} from '../../common/util/jquery'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { config } from './config'
import { createForm } from './html'
import {
  applyMetamorph,
  checkTokens,
  rollbackToPrePolymorphData,
  savePolymorphData,
} from './polymorph'

const logger = getLoggerInstance()

const getTransformSpellLevel = (htm: JQuery): number | undefined => {
  const metamorphTransformSpellLevelValue = parseInt(
    getInputElement(htm, '#transformation-spell-level').value,
  )

  if (!isNaN(metamorphTransformSpellLevelValue)) {
    return metamorphTransformSpellLevelValue
  }

  return undefined
}

const triggerMetamorph = async (
  htm: JQuery,
  controlledTokens: TokenPF[],
): Promise<void> => {
  try {
    const metamorphTransformKey = getSelectElementValue(
      htm,
      '#metamorph-transformation',
    )

    const metamorphTransformSpellLevel = getTransformSpellLevel(htm)

    const metamorphTransform = config.transformations[metamorphTransformKey]
    if (metamorphTransform === undefined) {
      ui.notifications.error('Cette transformation est inconnue')
      return
    }

    const { buff, tokenTexture } = metamorphTransform

    checkTokens(controlledTokens)

    await savePolymorphData(controlledTokens, buff.name)
    await applyMetamorph(
      controlledTokens,
      buff.compendium,
      buff.name,
      metamorphTransformSpellLevel,
      tokenTexture,
    )
  } catch (error) {
    ui.notifications.error(
      "L'exécution du script à échoué, voir la console pour plus d'information",
    )
    logger.error(error)
  }
}

const cancelMetamorph = async (controlledTokens: TokenPF[]): Promise<void> => {
  await rollbackToPrePolymorphData(controlledTokens)
}

const openDialog = (controlledTokens: TokenPF[]) => {
  const form = createForm()

  new Dialog({
    title: 'Metamorph',
    content: form,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: 'Annuler la transformation',
        callback: () => cancelMetamorph(controlledTokens),
      },
      trigger: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: 'Confirmer la transformation',
        callback: (htm) => triggerMetamorph(htm, controlledTokens),
      },
    },
  }).render(true)
}

try {
  logger.level = LogLevel.DEBUG

  const {
    tokens: { controlled: controlledTokens },
  } = canvas

  if (controlledTokens.length > 0) {
    openDialog(controlledTokens)
  } else {
    ui.notifications.info("Aucun token n'est sélectionné")
  }
} catch (error) {
  ui.notifications.error(
    "L'exécution du script à échoué, voir la console pour plus d'information",
  )
  logger.error(error)
}
