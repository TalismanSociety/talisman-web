import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains/recoils'
import { type BN } from '@polkadot/util'
import { type Decimal } from '@talismn/math'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type Options = { fiatCurrency?: string; allowInvalidValue?: boolean }

export const useTokenAmount = (
  amount: string,
  options: Options = { fiatCurrency: 'usd', allowInvalidValue: false }
) => {
  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(options.fiatCurrency)])
  )

  const decimalAmount = useMemo(() => {
    if (amount === undefined) return undefined
    try {
      return nativeTokenDecimal.fromUserInput(amount)
    } catch (error) {
      if (!options.allowInvalidValue) {
        throw error
      }

      return undefined
    }
  }, [amount, nativeTokenDecimal, options.allowInvalidValue])

  const fiatAmount = useMemo(
    () => (decimalAmount === undefined ? undefined : decimalAmount.toNumber() * nativeTokenPrice),
    [decimalAmount, nativeTokenPrice]
  )

  const localizedFiatAmount = useMemo(
    () =>
      fiatAmount?.toLocaleString(undefined, {
        style: 'currency',
        currency: options.fiatCurrency ?? 'usd',
        currencyDisplay: 'narrowSymbol',
      }),
    [fiatAmount, options?.fiatCurrency]
  )

  return { decimalAmount, fiatAmount, localizedFiatAmount } as const
}

export const useTokenAmountFromPlanck = <T extends string | BN | bigint | undefined>(
  planck: T,
  options: Options = { fiatCurrency: 'usd', allowInvalidValue: false }
) => {
  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(options.fiatCurrency)])
  )

  // to ensure no wasteful re-render
  const planckKey = planck?.toString()

  const decimalAmount = useMemo<undefined extends T ? Decimal | undefined : Decimal>(() => {
    if (planck === undefined) return undefined as any
    try {
      return nativeTokenDecimal.fromPlanck(planck)
    } catch (error) {
      if (!options.allowInvalidValue) {
        throw error
      }

      return undefined as any
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativeTokenDecimal, options.allowInvalidValue, planckKey])

  const fiatAmount = useMemo<undefined extends T ? number | undefined : number>(
    () => (decimalAmount === undefined ? (undefined as any) : decimalAmount.toNumber() * nativeTokenPrice),
    [decimalAmount, nativeTokenPrice]
  )

  const localizedFiatAmount = useMemo<undefined extends T ? string | undefined : string>(
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
  options: Options = { fiatCurrency: 'usd', allowInvalidValue: true }
) => {
  const [amount, setAmount] = useState(initialState)

  return [{ ...useTokenAmount(amount, options), amount }, setAmount] as const
}
