export enum LogLevel {
  'DEBUG' = 0,
  'INFO' = 1,
  'WARN' = 2,
  'ERROR' = 3,
}

export interface Logger {
  debug: (message: any, context?: Record<string, any>) => void
  info: (message: any, context?: Record<string, any>) => void
  warn: (message: any, context?: Record<string, any>) => void
  error: (message: any, context?: Record<string, any>) => void
  level: LogLevel
  macroName: string | undefined
}

let logger: Logger | undefined = undefined

const createLogger = (): Logger => {
  const macroName: string | undefined = undefined
  const level: LogLevel = LogLevel.INFO

  const createMacroNameFlag = (macroName: string | undefined) =>
    macroName ? `[${macroName}]` : ''

  return {
    debug: (message: any, context?: Record<string, any>) => {
      if (level >= LogLevel.DEBUG) {
        console.log(
          `${createMacroNameFlag(macroName)}[DEBUG] `,
          message,
          context,
        )
      }
    },
    info: (message: any, context?: Record<string, any>) => {
      if (level >= LogLevel.INFO) {
        console.log(`${createMacroNameFlag(macroName)}[INFO]`, message, context)
      }
    },
    warn: (message: any, context?: Record<string, any>) => {
      if (level >= LogLevel.WARN) {
        console.warn(
          `${createMacroNameFlag(macroName)}[WARN]`,
          message,
          context,
        )
      }
    },
    error: (message: any, context?: Record<string, any>) => {
      if (level >= LogLevel.ERROR) {
        console.error(
          `${createMacroNameFlag(macroName)}[ERROR]`,
          message,
          context,
        )
      }
    },
    level,
    macroName,
  }
}

export const getLoggerInstance = (): Logger => {
  if (logger === undefined) {
    logger = createLogger()
  }

  return logger
}
