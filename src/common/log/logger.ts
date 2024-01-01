export enum LogLevel {
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR',
}

export interface Logger {
  debug: (message: unknown, context?: Record<string, any>) => void
  info: (message: unknown, context?: Record<string, any>) => void
  warn: (message: unknown, context?: Record<string, any>) => void
  error: (message: unknown, context?: Record<string, any>) => void
  setLevel: (newLevel: LogLevel) => void
  setMacroName: (newMacroName?: string) => void
}

let logger: Logger | undefined = undefined

const createLogger = (): Logger => {
  let level: LogLevel = LogLevel.INFO
  let macroName: string | undefined = undefined

  const createMacroNameFlag = () => (macroName ? `[${macroName}]` : '')

  const writeConsoleMessage = (
    levelString: string,
    message: unknown,
    context?: unknown,
  ) => {
    if (context) {
      console.log(`${createMacroNameFlag()}[${levelString}]`, message, context)
      return
    }

    console.log(`${createMacroNameFlag()}[${levelString}]`, message)
  }

  return {
    debug: (message: unknown, context?: unknown) => {
      if (level > LogLevel.DEBUG) {
        return
      }

      writeConsoleMessage('DEBUG', message, context)
    },
    info: (message: unknown, context?: Record<string, any>) => {
      if (level > LogLevel.INFO) {
        return
      }

      writeConsoleMessage('INFO', message, context)
    },
    warn: (message: unknown, context?: Record<string, any>) => {
      if (level > LogLevel.WARN) {
        return
      }

      writeConsoleMessage('WARN', message, context)
    },
    error: (message: unknown, context?: Record<string, any>) => {
      if (level > LogLevel.ERROR) {
        return
      }

      writeConsoleMessage('ERROR', message, context)
    },
    setLevel: (newLevel: LogLevel) => {
      level = newLevel
    },
    setMacroName: (newMacroName?: string) => {
      macroName = newMacroName
    },
  }
}

export const getLoggerInstance = (): Logger => {
  if (logger === undefined) {
    logger = createLogger()
  }

  return logger
}
