import { Balance, EMPTY_BALANCE } from '@domains/multisig'
import Decimal from 'decimal.js'

export const formatUsd = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const balanceToFloat = (b: Balance | undefined): number => {
  const balance = b ?? EMPTY_BALANCE
  return new Decimal(balance.amount.toString()).div(new Decimal(10).pow(balance.token.decimals)).toNumber()
}
