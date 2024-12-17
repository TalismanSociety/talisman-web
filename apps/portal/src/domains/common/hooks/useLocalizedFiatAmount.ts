import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import type { Decimal } from '@/util/Decimal'
import { selectedCurrencyState } from '@/domains/balances/currency'
import { useNativeTokenPriceState } from '@/domains/chains/recoils'

/**
 * TODO: this only works with native token for now
 * refactor this to take a token object instead
 */
export const useNativeTokenLocalizedFiatAmount = (tokenAmount: Decimal | undefined) => {
  const currency = useRecoilValue(selectedCurrencyState)
  const price = useRecoilValue(useNativeTokenPriceState())

  return useMemo(
    () =>
      tokenAmount
        ? (tokenAmount.toNumber() * price).toLocaleString(undefined, { style: 'currency', currency })
        : undefined,
    [currency, price, tokenAmount]
  )
}
