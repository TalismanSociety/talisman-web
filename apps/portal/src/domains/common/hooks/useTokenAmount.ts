import type { BN } from '@polkadot/util'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import type { Decimal } from '@/util/Decimal'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { useNativeTokenDecimalState, useNativeTokenPriceState } from '@/domains/chains/recoils'

type Options<TAllowInvalid extends boolean = boolean> = { currency?: string; allowInvalidValue?: TAllowInvalid }

export type TokenAmount = ReturnType<typeof useTokenAmount>

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

export type TokenAmountFromPlank = ReturnType<typeof useTokenAmountFromPlanck>

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (planck === undefined) return undefined as any
    try {
      return nativeTokenDecimal.fromPlanck(planck.toString())
    } catch (error) {
      if (!options.allowInvalidValue) {
        throw error
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return undefined as any
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nativeTokenDecimal, options.allowInvalidValue, planckKey])

  const fiatAmount = useMemo<undefined extends T ? number | undefined : number>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (decimalAmount === undefined ? (undefined as any) : decimalAmount.toNumber() * nativeTokenPrice),
    [decimalAmount, nativeTokenPrice]
  )

  const localizedFiatAmount = useMemo<undefined extends T ? string | undefined : string>(
    () =>
      fiatAmount?.toLocaleString(undefined, {
        style: 'currency',
        currency,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
