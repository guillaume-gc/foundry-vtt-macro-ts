import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { getInputElement } from '../../common/util/jquery'
import { notifyError } from '../../common/util/notifications'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { HTMLController, createHtmlController } from './html'
import {
  applyMetamorph,
  checkTokens,
  isAtLeastOneTokenActive,
} from './metamorph'
import { rollbackToPreMetamorphData, saveMetamorphData } from './save'

const logger = getLoggerInstance()

const getNumberFromInputIfSpecified = (
  htm: JQuery,
  selector: string,
): number | undefined => {
  const value: number | undefined = parseInt(
    getInputElement(htm, selector)?.value,
  )

  if (!isNaN(value)) {
    return value
  }

  return
}

const getCheckedFromInputIfSpecified = (
  htm: JQuery,
  selector: string,
): boolean | undefined => {
  const value: boolean | undefined = getInputElement(htm, selector).checked

  if (value !== undefined) {
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
    logger.info('Trigger Metamorph')

    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-level',
    )

    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      '#transformation-spell-difficulty-check',
    )

    const metamorphReplace =
      getCheckedFromInputIfSpecified(htm, '#transformation-replace') ?? false

    const elementTransformation = htmlController.getTransformation()

    logger.info(`Transformation will be ${elementTransformation.label}`)

    checkTokens(controlledTokens, elementTransformation, metamorphReplace)

    // Hide visible token before updating them (so that players cannot see if a transmutation is canceled before happening).
    const tokensToHide = controlledTokens.filter(({ visible }) => visible)
    await setTokensVisibility(tokensToHide, false)

    if (metamorphReplace) {
      await cancelMetamorphBeforeApply(controlledTokens)
    }

    await saveMetamorphData(controlledTokens, elementTransformation)
    await applyMetamorph(controlledTokens, elementTransformation, {
      metamorphTransformSpellLevel,
      metamorphSpellDifficultyCheck,
    })

    // Now that the transformation is complete, show hidden tokens.
    await setTokensVisibility(tokensToHide, true)

    logger.info(`Transformation completed`)
  } catch (error) {
    notifyError(error)
  }
}

const cancelMetamorphBeforeApply = async (
  controlledTokens: TokenPF[],
): Promise<void> => {
  if (!isAtLeastOneTokenActive(controlledTokens)) {
    logger.info('No token is active, nothing to cancel')

    return
  }

  logger.info('At least one token is active and should be canceled')

  await cancelMetamorph(controlledTokens)
}

const cancelMetamorph = async (controlledTokens: TokenPF[]): Promise<void> => {
  try {
    await rollbackToPreMetamorphData(controlledTokens)
  } catch (error) {
    notifyError(error)
  }
}

const setTokensVisibility = async (
  controlledTokens: TokenPF[],
  visible: boolean,
): Promise<void> => {
  const actions = controlledTokens.map((token) =>
    token.document.update({ visible }),
  )

  await Promise.all(actions)
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
  logger.setLevel(LogLevel.INFO)
  logger.setMacroName('pf1-metamorph')

  const {
    tokens: { controlled: controlledTokens },
  } = canvas

  if (controlledTokens.length > 0) {
    openDialog(controlledTokens)
  } else {
    ui.notifications.warn("Aucun token n'est sélectionné")
  }
} catch (error) {
  notifyError(error)
}
