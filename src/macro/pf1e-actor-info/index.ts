import { ActorPF } from '../../type/foundry/system/pf1e'
import { renderAll, renderCombatDefenses, renderSocialDefenses } from './chat'
import { getInitialMsg } from './html'

const openDialog = (actors: ActorPF[]) => {
  new Dialog({
    title: "Obtenir les informations d'acteurs",
    content: getInitialMsg(actors),
    buttons: {
      socialDefenses: {
        label: 'Social',
        callback: () => renderSocialDefenses(actors),
      },
      combatDefenses: {
        label: 'Combat',
        callback: () => renderCombatDefenses(actors),
      },
      all: {
        label: 'Tout',
        callback: () => renderAll(actors),
      },
    },
  }).render(true)
}

try {
  const {
    tokens: { controlled: selectedTokens },
  } = canvas

  const compatibleActors = selectedTokens
    .map(({ actor }) => actor)
    .filter(({ testUserPermission }) => testUserPermission(game.user, 'OWNER'))

  if (!compatibleActors.length) {
    ui.notifications.warn('Aucun acteur compatible trouvé')
  } else {
    openDialog(compatibleActors)
  }
} catch (error) {
  ui.notifications.error(
    "Une erreur a été détecté lors de l'exécution du script, veillez voir la console pour plus d'information",
  )
  console.error(error)
}
