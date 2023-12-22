import { UserWarning } from '../../common/error/user-warning'
import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import {
  applyMetamorph,
  checkTokens,
  rollbackToPrePolymorphData,
  savePolymorphData,
} from './polymorph'

const logger = getLoggerInstance()

const main = async (): Promise<void> => {
  logger.level = LogLevel.DEBUG

  const {
    tokens: { controlled },
  } = canvas

  if (controlled.length === 0) {
    ui.notifications.info("Aucun token n'est sélectionné")
    return
  }

  const buffName = 'rapetissement'
  const compendiumName = 'world.effets-metamorph'

  checkTokens(controlled)

  await savePolymorphData(controlled, buffName)
  await applyMetamorph(controlled, compendiumName, buffName, 15)

  await new Promise((resolve) => setTimeout(resolve, 5000))

  await rollbackToPrePolymorphData(controlled)
}

main().catch((error) => {
  if (error instanceof UserWarning) {
    ui.notifications.warn(error.message)
    return
  }

  ui.notifications.error(
    "L'exécution du script à échoué, voir la console pour plus d'information",
  )
  console.error(error)
})
