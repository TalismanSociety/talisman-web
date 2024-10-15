import { atom } from 'jotai'

import { transferAtom } from './transferAtom'

export const minMaxAmountsAtom = atom(async get => {
  const transfer = await get(transferAtom)
  if (!transfer) return

  const { min, max } = transfer.source

  return { min, max }
})
