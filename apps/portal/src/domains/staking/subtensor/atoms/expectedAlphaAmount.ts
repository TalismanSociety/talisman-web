import { atom } from 'jotai'

import { type TokenAmount } from '@/domains/common/hooks/useTokenAmount'

export const expectedAlphaAmountAtom = atom<TokenAmount>({
  decimalAmount: undefined,
  fiatAmount: undefined,
  localizedFiatAmount: undefined,
})
