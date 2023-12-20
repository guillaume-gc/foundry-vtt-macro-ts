import { TokenPF } from '../../type/foundry/system/pf1/pf1'
import { findBuffInActor } from './buff'

const applyMetamorph = async (
  tokens: TokenPF[],
  buffName: string,
  buffLevel?: number,
) => {
  const operations = tokens.map(async ({ actor }) => {
    const buff = findBuffInActor(actor, buffName)

    console.log('buff', buff)

    const updateQuery = {
      'system.level': buffLevel,
      'system.active': true,
    }

    return buff.update(updateQuery)
  })

  await Promise.all(operations)
}

const main = async (): Promise<void> => {
  const {
    tokens: { controlled },
  } = canvas

  await applyMetamorph(controlled, 'Vision des Héros des Terres Inondées', 15)
}

main().catch((error) => {
  ui.notifications.error("Erreur, voir la console pour plus d'information")
  console.error(error)
})
