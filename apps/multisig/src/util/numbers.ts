import { Balance, EMPTY_BALANCE } from '@domains/multisig'
import Decimal from 'decimal.js'
import BN from 'bn.js'

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

export const parseUnits = (amount: string | number, decimals: number): BN => {
  return new BN(
    new Decimal(amount)
      .mul(Decimal.pow(10, decimals))
      .toDecimalPlaces(0) // to round it
      .toFixed() // convert it back to string
  )
}

export const formatUnits = (amountBN: BN | bigint, decimals: number): string => {
  return new Decimal(amountBN.toString()).div(new Decimal(10).pow(decimals)).toFixed()
}
