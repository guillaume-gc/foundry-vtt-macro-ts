import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { findBuffInActor } from './buff'

const applyMetamorph = async (
  tokens: TokenPF[],
  buffName: string,
  buffLevel?: number,
) => {
  const buffOperations = tokens.map(async ({ actor }) => {
    const buff = findBuffInActor(actor, buffName)

    console.log('buff', buff)

    const updateQuery = {
      'system.level': buffLevel,
      'system.active': true,
    }

    return buff.update(updateQuery)
  })

  const actorsOperations = tokens.map(async ({ actor }) => {
    return actor.update({ 'system.traits.size': 'huge' })
  })

  const tokensOperations = tokens.map(async (token) => {
    return token.document.update({
      'texture.src':
        'https://assets.forge-vtt.com/62ab17b89633ba24d7994900/tokens/PC/Seioden%20v2.png',
    })
  })

  const operations = [
    ...buffOperations,
    ...actorsOperations,
    ...tokensOperations,
  ]

  await Promise.all(operations)
}

const saveActorRelevantData = async (tokens: TokenPF[]) => {
  const operations = tokens.map(async (token) => {
    const actorData = {
      'system.traits.size': token.actor.system.traits.size,
    }
    const tokenData = {
      'document.texture.src': token.document.texture.src,
    }

    await token.actor.update({
      flags: {
        metamorph: {
          actorData,
          tokenData,
        },
      },
    })
  })

  await Promise.all(operations)
}

const main = async (): Promise<void> => {
  const {
    tokens: { controlled },
  } = canvas

  if (controlled.length === 0) {
    ui.notifications.info("Aucun token n'est sélectionné")
  }

  await saveActorRelevantData(controlled)
  await applyMetamorph(controlled, 'Vision des Héros des Terres Inondées', 15)
}

main().catch((error) => {
  ui.notifications.error(
    "L'exécution du script à échoué, voir la console pour plus d'information",
  )
  console.error(error)
})
