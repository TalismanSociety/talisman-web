import { atom } from 'jotai'

import { type TokenAmount } from '@/domains/common/hooks/useTokenAmount'

export const dTaoConversionRateAtom = atom<TokenAmount>({
  decimalAmount: undefined,
  fiatAmount: undefined,
  localizedFiatAmount: undefined,
})
