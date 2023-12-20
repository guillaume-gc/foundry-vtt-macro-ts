import { findBuffInActor, findBuffInCompendium } from './buff'

try {
  const {
    tokens: { controlled },
  } = canvas

  const actor = controlled[0].actor

  const actorBuff = findBuffInActor(actor, 'Vision magique')
  const compendiumBuff = findBuffInCompendium(
    'world.effets-de-sorts',
    'Rapetissement (n)',
  )

  console.log('actorBuff', actorBuff)
  console.log('compendiumBuff', compendiumBuff)
} catch (error) {
  ui.notifications.error("Erreur, voir la console pour plus d'information")
  console.error(error)
}
