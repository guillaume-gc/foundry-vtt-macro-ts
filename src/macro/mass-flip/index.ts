import { FoundryVTT } from '../../../type/foundryVtt.type'
import { editInnerHtml } from '../../common/util/jquery'
import { knownActorGroups } from './config'
import { flipTokens } from './flip'
import { createForm, createImageOptions } from './html'

const openDialog = (
  currentActorGroups: Set<string>,
  ownedTokens: FoundryVTT.TokenPF[],
) => {
  const form = createForm(currentActorGroups)

  new Dialog({
    title: 'Mass flip',
    content: form,
    buttons: {
      use: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: 'Confirmer le flip',
        callback: (htm) => flipTokens(htm, ownedTokens),
      },
    },
    render: (htm) => {
      htm.find('#actorGroup').change(() => refreshImageOptions(htm))

      refreshImageOptions(htm)
    },
  }).render(true)
}

const refreshImageOptions = (htm: JQuery) => {
  const imageOptions = createImageOptions(htm)

  editInnerHtml(htm, '#mass-flip-images', imageOptions)
}

try {
  const {
    tokens: { ownedTokens },
  } = canvas

  const actorGroupNames = new Set<string>(
    ownedTokens
      .map((token) => encodeURI(token.document.name))
      .filter((encodedTokenName) =>
        Object.keys(knownActorGroups).includes(encodedTokenName),
      ),
  )

  openDialog(actorGroupNames, ownedTokens)
} catch (error) {
  ui.notifications.error("Erreur, voir la console pour plus d'information")
  console.error(error)
}
