import { atom } from 'jotai'

import { toPreciseDecimals } from '../utils/toPreciseDecimals'
import { transferAtom } from './transferAtom'
import { amountAtom } from './xcmFieldsAtoms'

export const requestMaxAtom = atom(null, async (get, set) => {
  const amount = get(amountAtom)
  const max = toPreciseDecimals((await get(transferAtom))?.source.max)
  if (!max) return
  if (amount === max) return

  set(amountAtom, max)
})
