import { atom } from 'jotai'

import { transferAtom } from './transferAtom'
import { amountAtom } from './xcmFieldsAtoms'

export const requestMaxAtom = atom(null, async (get, set) => {
  const amount = get(amountAtom)
  const max = (await get(transferAtom))?.source.max
  if (max && amount !== max.toDecimal()) set(amountAtom, max.toDecimal())
})
