import { UserWarning } from '../error/user-warning'

export const notifyError = (error: unknown): void => {
  if (error instanceof UserWarning) {
    console.warn(error)
    ui.notifications.warn(error.message)

    return
  }

  console.error(error)
  ui.notifications.error(
    "L'exécution du script a échoué, voir la console pour plus d'information",
  )
}
