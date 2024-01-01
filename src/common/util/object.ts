import { getLoggerInstance } from '../log/logger'

const logger = getLoggerInstance()

export const getObjectValue = <T = any>(
  obj: any,
  path: string,
): T | undefined => {
  if (obj == undefined) {
    return
  }

  const stack = path.split('.')

  logger.debug('Get object value: ready', {
    stack,
  })

  let value = obj
  let subAtt = stack.shift()

  logger.debug('Get object value: before iteration', {
    value,
    subAtt,
    stack,
  })

  while (subAtt !== undefined) {
    value = value[subAtt]
    subAtt = stack.shift()

    logger.debug('Get object value: iteration', {
      value,
      subAtt,
      stack,
    })
  }

  logger.debug('Get object value: final value', {
    value,
    subAtt,
    stack,
  })

  return value as T | undefined
}
