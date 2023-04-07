import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains/recoils'
import { BN } from '@polkadot/util'
import Decimal from '@util/Decimal'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type Options = { fiatCurrency?: string }

export const useTokenAmount = <T extends string | undefined>(
  amount?: T,
  options: Options = { fiatCurrency: 'usd' }
) => {
  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(options.fiatCurrency)])
  )

  const decimalAmount = useMemo<T extends undefined ? Decimal | undefined : Decimal>(() => {
    if (amount === undefined) return undefined
    try {
      return nativeTokenDecimal.fromUserInput(amount)
    } catch {
      return undefined as any
    }
  }, [amount, nativeTokenDecimal])

  const fiatAmount = useMemo<T extends undefined ? number | undefined : number>(
    () => (decimalAmount === undefined ? (undefined as any) : decimalAmount.toNumber() * nativeTokenPrice),
    [decimalAmount, nativeTokenPrice]
  )

  const localizedFiatAmount = useMemo<T extends undefined ? string | undefined : string>(
    () =>
      fiatAmount?.toLocaleString(undefined, {
        style: 'currency',
        currency: options.fiatCurrency ?? 'usd',
        currencyDisplay: 'narrowSymbol',
      }) as any,
    [fiatAmount, options?.fiatCurrency]
  )

  return { decimalAmount, fiatAmount, localizedFiatAmount } as const
}

export const useTokenAmountFromPlanck = <T extends string | BN | bigint | undefined>(
  planck?: T,
  options: Options = { fiatCurrency: 'usd' }
) => {
  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(options.fiatCurrency)])
  )

  const decimalAmount = useMemo<T extends undefined ? Decimal | undefined : Decimal>(() => {
    if (planck === undefined) return undefined
    try {
      return nativeTokenDecimal.fromPlanck(planck)
    } catch {
      return undefined as any
    }
  }, [nativeTokenDecimal, planck])

  const fiatAmount = useMemo<T extends undefined ? number | undefined : number>(
    () => (decimalAmount === undefined ? (undefined as any) : decimalAmount.toNumber() * nativeTokenPrice),
    [decimalAmount, nativeTokenPrice]
  )

  const localizedFiatAmount = useMemo<T extends undefined ? string | undefined : string>(
    () =>
      fiatAmount?.toLocaleString(undefined, {
        style: 'currency',
        currency: options.fiatCurrency ?? 'usd',
        currencyDisplay: 'narrowSymbol',
      }) as any,
    [fiatAmount, options?.fiatCurrency]
  )

  return { decimalAmount, fiatAmount, localizedFiatAmount } as const
}

export const useTokenAmountState = (
  initialState: string | (() => string),
  options: Options = { fiatCurrency: 'usd' }
) => {
  const [amount, setAmount] = useState(initialState)

  return [{ ...useTokenAmount(amount, options), amount }, setAmount] as const
}
