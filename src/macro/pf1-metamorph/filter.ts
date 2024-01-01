import { getLoggerInstance } from '../../common/log/logger'
import { getObjectValue } from '../../common/util/object'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPFType } from '../../type/foundry/system/pf1/documents/item/item-pf'

export type MetamorphFilter = MetamorphEqualityFilter | MetamorphHasItemFilter

const logger = getLoggerInstance()

interface MetamorphEqualityFilter {
  type: 'equality'
  path: string
  value: string | number | boolean | undefined
}

interface MetamorphHasItemFilter {
  type: 'hasItem'
  item: {
    name: string
    type: ItemPFType
  }
}

export const checkFilter = (
  actor: ActorPF,
  filter: MetamorphFilter,
): boolean => {
  switch (filter.type) {
    case 'equality':
      return checkStrictEqualityFilter(actor, filter)
    case 'hasItem':
      return checkHasItemFilter(actor, filter)
  }
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

const checkHasItemFilter = (
  actor: ActorPF,
  filter: MetamorphHasItemFilter,
): boolean => {
  logger.debug('Check has item filter', {
    filter,
    actor,
  })

  const foundItem = actor.items.find(
    (item) =>
      item.name.toLowerCase() === filter.item.name.toLowerCase() &&
      item.type === filter.item.type,
  )

  return foundItem !== undefined
}
