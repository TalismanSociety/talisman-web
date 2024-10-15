import { atom } from 'jotai'

import { transferAtom } from './transferAtom'

export const feesAtom = atom(async get => {
  const transfer = await get(transferAtom)
  if (!transfer) return

  const sourceFee = `~${transfer.source.fee.toDecimal()} ${transfer.source.fee.symbol}`
  const destFee = `~${transfer.destination.fee.toDecimal()} ${transfer.destination.fee.symbol}`

  return { sourceFee, destFee }
})
