import { nativeTokenDecimalState, nativeTokenPriceState } from '@domains/chains/recoils'
import { BN } from '@polkadot/util'
import { useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

type Options = { fiatCurrency?: string }

export const useTokenAmount = (amount?: string | (() => string), options: Options = { fiatCurrency: 'usd' }) => {
  const stringAmount = typeof amount === 'function' ? amount() : amount

  const [nativeTokenDecimal, nativeTokenPrice] = useRecoilValue(
    waitForAll([nativeTokenDecimalState, nativeTokenPriceState(options.fiatCurrency ?? 'usd')])
  )

  const decimalAmount = useMemo(() => {
    if (stringAmount === undefined) return undefined
    try {
      return nativeTokenDecimal.fromUserInput(stringAmount)
    } catch {
      return undefined
    }
  }, [stringAmount, nativeTokenDecimal])

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

export const useTokenAmountFromPlanck = (planck?: string | BN, options: Options = { fiatCurrency: 'usd' }) => {
  const nativeTokenDecimal = useRecoilValue(nativeTokenDecimalState)

  return useTokenAmount(planck === undefined ? undefined : nativeTokenDecimal.fromPlanck(planck).toString(), options)
}

export const useTokenAmountState = (
  initialState: string | (() => string),
  options: Options = { fiatCurrency: 'usd' }
) => {
  const [amount, setAmount] = useState(initialState)

  return [{ ...useTokenAmount(amount, options), amount }, setAmount] as const
}
