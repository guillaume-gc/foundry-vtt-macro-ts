import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { getSelectElementValue } from '../../common/util/jquery'
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

const triggerMetamorph = async (
  htm: JQuery,
  controlledTokens: TokenPF[],
): Promise<void> => {
  const metamorphTransformKey = getSelectElementValue(
    htm,
    '#metamorph-transformation',
  )
  const metamorphTransform = config.transformations[metamorphTransformKey]
  if (metamorphTransform === undefined) {
    throw new Error(`Unknown transform ${metamorphTransformKey} key`)
  }

  const { buff, tokenTexture } = metamorphTransform

  checkTokens(controlledTokens)

  await savePolymorphData(controlledTokens, buff.name)
  await applyMetamorph(
    controlledTokens,
    buff.compendium,
    buff.name,
    15,
    tokenTexture,
  )
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
