import { range } from 'lodash'

export const getErasToCheck = (activeEra: number, bondingDuration: number) =>
  range(activeEra - bondingDuration, activeEra + 1).reverse()
