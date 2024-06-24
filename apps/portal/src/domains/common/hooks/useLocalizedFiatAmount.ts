import { selectedCurrencyState } from '../../balances'
import { useNativeTokenPriceState } from '../../chains'
import type { Decimal } from '@talismn/math'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

/**
 * TODO: this only works with native token for now
 * refactor this to take a token object instead
 */
export const useNativeTokenLocalizedFiatAmount = (tokenAmount: Decimal) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const price = useRecoilValue(useNativeTokenPriceState())

  return useMemo(
    () => (tokenAmount.toNumber() * price).toLocaleString(undefined, { style: 'currency', currency }),
    [currency, price, tokenAmount]
  )
}
