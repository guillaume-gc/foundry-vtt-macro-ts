import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { getInputElement } from '../../common/util/jquery'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { HTMLController, createHtmlController } from './html'
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
  htmlController: HTMLController,
): Promise<void> => {
  try {
    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-level',
    )

    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-difficulty-check',
    )

    checkTokens(controlledTokens)

    const elementTransformation = htmlController.getTransformation()

    await savePolymorphData(controlledTokens, elementTransformation)
    await applyMetamorph(
      controlledTokens,
      elementTransformation,
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
  const htmlController = createHtmlController()

  new Dialog({
    title: 'Metamorph',
    content: htmlController.createForm(),
    buttons: {
      cancel: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: 'Annuler la transformation',
        callback: () => cancelMetamorph(controlledTokens),
      },
      trigger: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: 'Confirmer la transformation',
        callback: (htm) =>
          triggerMetamorph(htm, controlledTokens, htmlController),
      },
    },
    render: (htm) => {
      htmlController.setHtm(htm)
      htmlController.setupRootSelectHtmlElement()
      htmlController.resetElementOptionsTree()
    },
  }).render(true)
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
