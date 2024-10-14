import { useTokenRates } from '@talismn/balances-react'
import { TokenRates } from '@talismn/token-rates'
import { useMemo } from 'react'

/**
 * Given a usd value, derive rate of this value in all available currencies:
 * Sometimes we are given a usd value, but we need to know the rate of this value in all available currencies
 * This hook gets the rates of a random token which has rates in all available currencies
 * and then derive the rates of the given usd value in all available currencies
 */
export const useTokenRatesFromUsd = (usdValue: string | number | undefined | null) => {
  const tokenRates = useTokenRates()
  return useMemo((): TokenRates | null => {
    if (usdValue === undefined || usdValue === null) return null

    const defaultTokenRate = Object.values(tokenRates ?? {})[0]
    if (!defaultTokenRate) return null
    const baseRate = defaultTokenRate.usd
    if (!baseRate) return null
    return Object.entries(defaultTokenRate).reduce((acc, [currency, rate]) => {
      if (rate === null || rate === undefined) return acc
      return {
        ...acc,
        [currency]: (+usdValue * rate) / baseRate,
      }
    }, {} as TokenRates)
  }, [tokenRates, usdValue])
}
