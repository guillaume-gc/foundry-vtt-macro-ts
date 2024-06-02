import { LogLevel, getLoggerInstance } from '../../common/log/logger'
import { notifyError } from '../../common/util/notifications'

const logger = getLoggerInstance()

try {
  logger.setLevel(LogLevel.INFO)
  logger.setMacroName('pf1-get-actors-data')

  const {
    tokens: { controlled: controlledTokens },
  } = canvas

  logger.info('controlledTokens', controlledTokens)
} catch (error) {
  notifyError(error)
}
