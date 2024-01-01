import { getLoggerInstance } from '../../common/log/logger'
import { getObjectValue } from '../../common/util/object'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'

export type MetamorphFilter = MetamorphEqualityFilter

const logger = getLoggerInstance()

interface MetamorphEqualityFilter {
  type: 'equality'
  path: string
  value: string | number | boolean | undefined
}

export const checkFilter = (
  actor: ActorPF,
  filter: MetamorphFilter,
): boolean => {
  if (filter.type === 'equality') {
    return checkStrictEqualityFilter(actor, filter)
  }

  throw new Error('Cannot check filter: unknown filter type')
}

const checkStrictEqualityFilter = (
  actor: ActorPF,
  filter: MetamorphEqualityFilter,
): boolean => {
  logger.debug('Check strict equality filter')

  const value = getObjectValue(actor, filter.path)

  logger.debug('Found value to compare', {
    value,
    filter,
    actor,
  })

  return value === filter.value
}
