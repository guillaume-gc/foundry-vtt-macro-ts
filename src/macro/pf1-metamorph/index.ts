import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import {
  editInnerHtml,
  getInputElement,
  getSelectElementValue,
} from '../../common/util/jquery'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { MetamorphTransformation, config } from './config'
import {
  createForm,
  createTransformationEffectDescription,
  createTransformationGroupValues,
} from './html'
import { applyMetamorph, checkTokens } from './polymorph'
import { rollbackToPrePolymorphData, savePolymorphData } from './save'

const logger = getLoggerInstance()

const getNumberFromInputIfSpecified = (
  htm: JQuery,
  selector: string,
): number | undefined => {
  const value = parseInt(getInputElement(htm, selector).value)

  if (!isNaN(value)) {
    return value
  }

  return value
}

const triggerMetamorph = async (
  htm: JQuery,
  controlledTokens: TokenPF[],
): Promise<void> => {
  try {
    const metamorphTransformGroupKey = getSelectElementValue(
      htm,
      '#metamorph-transformation-group',
    )

    const metamorphTransformEffectKey = getSelectElementValue(
      htm,
      '#metamorph-transformation',
    )

    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-level',
    )

    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-difficulty-check',
    )

    const metamorphTransformEffect: MetamorphTransformation | undefined =
      config.groups[metamorphTransformGroupKey].transformation[
        metamorphTransformEffectKey
      ]
    if (metamorphTransformEffect === undefined) {
      ui.notifications.error('Cette transformation est inconnue')
      return
    }

    checkTokens(controlledTokens)

    await savePolymorphData(controlledTokens, metamorphTransformEffect)
    await applyMetamorph(
      controlledTokens,
      metamorphTransformEffect,
      metamorphTransformSpellLevel,
      metamorphSpellDifficultyCheck,
    )
  } catch (error) {
    ui.notifications.error(
      "L'exécution du script a échoué, voir la console pour plus d'information",
    )
    console.error(error)
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
    render: (htm) => {
      const $transformGroupElement = htm.find('#metamorph-transformation-group')
      const $transformElement = htm.find('#metamorph-transformation')
      if (
        $transformGroupElement.length === 0 ||
        $transformElement.length === 0
      ) {
        throw new Error('Could not find relevant JQuery elements')
      }

      $transformGroupElement.on('change', () => {
        refreshTransformationEffectOptions(htm)
        refreshTransformationEffectDescription(htm)
      })

      $transformElement.on('change', () => {
        refreshTransformationEffectDescription(htm)
      })

      refreshTransformationEffectOptions(htm)
      refreshTransformationEffectDescription(htm)
    },
  }).render(true)
}

const refreshTransformationEffectOptions = (htm: JQuery<HTMLElement>) => {
  const transformationEffectValues = createTransformationGroupValues(htm)

  editInnerHtml(
    htm,
    '#metamorph-transformation',
    transformationEffectValues.optionValue,
  )
  editInnerHtml(
    htm,
    '#metamorph-transformation-group-description',
    transformationEffectValues.description ?? '',
  )
}

const refreshTransformationEffectDescription = (htm: JQuery<HTMLElement>) => {
  const transformEffectDescription = createTransformationEffectDescription(htm)

  editInnerHtml(
    htm,
    '#metamorph-transformation-description',
    transformEffectDescription ?? '',
  )
}

try {
  logger.setLevel(LogLevel.DEBUG)
  logger.setMacroName('pf1-metamorph')

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
    "L'exécution du script a échoué, voir la console pour plus d'information",
  )
  console.error(error)
}
