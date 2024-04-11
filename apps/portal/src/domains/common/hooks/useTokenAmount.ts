import { selectedCurrencyState } from '@domains/balances'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@domains/chains/recoils'
import { type BN } from '@polkadot/util'
import { type Decimal } from '@talismn/math'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type Options<TAllowInvalid extends boolean = boolean> = { currency?: string; allowInvalidValue?: TAllowInvalid }

export const useTokenAmount = <TAllowInvalid extends boolean = true>(
  amount: string,
  options: Options<TAllowInvalid> = { allowInvalidValue: true as TAllowInvalid }
) => {
  type Return = TAllowInvalid extends true
    ? { decimalAmount: Decimal | undefined; fiatAmount: number | undefined; localizedFiatAmount: string | undefined }
    : { decimalAmount: Decimal; fiatAmount: number; localizedFiatAmount: string }

  const [nativeTokenDecimal, nativeTokenPrice, selectedCurrency] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(), selectedCurrencyState])
  )

  const currency = options.currency ?? selectedCurrency

  const decimalAmount = useMemo(() => {
    if (amount === undefined) return undefined
    try {
      return nativeTokenDecimal.fromUserInput(amount) as Decimal | undefined
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
        currency,
      }),
    [currency, fiatAmount]
  )

  return { decimalAmount, fiatAmount, localizedFiatAmount } as Return
}

export const useTokenAmountFromPlanck = <
  T extends string | number | BN | bigint | undefined,
  TAllowInvalid extends boolean = false
>(
  planck: T,
  options: Options<TAllowInvalid> = { allowInvalidValue: false as TAllowInvalid }
) => {
  type NullableReturn = {
    decimalAmount: Decimal | undefined
    fiatAmount: number | undefined
    localizedFiatAmount: string | undefined
  }
  type NonNullableReturn = { decimalAmount: Decimal; fiatAmount: number; localizedFiatAmount: string }
  type Return = T extends undefined ? NullableReturn : TAllowInvalid extends true ? NullableReturn : NonNullableReturn

  const [nativeTokenDecimal, nativeTokenPrice, selectedCurrency] = useRecoilValue(
    waitForAll([useNativeTokenDecimalState(), useNativeTokenPriceState(), selectedCurrencyState])
  )

  const currency = options.currency ?? selectedCurrency

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
        currency,
      }) as any,
    [currency, fiatAmount]
  )

  return { decimalAmount, fiatAmount, localizedFiatAmount } as Return
}

export const useTokenAmountState = (
  initialState: string | (() => string),
  options: Options = { allowInvalidValue: true }
) => {
  const [amount, setAmount] = useState(initialState)

  return [{ ...useTokenAmount(amount, options), amount }, setAmount] as const
}
