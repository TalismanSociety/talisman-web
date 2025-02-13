import { atom } from 'jotai'

import { type TokenAmountFromPlank } from '@/domains/common/hooks/useTokenAmount'

export const talismanTokenFeeAtom = atom<TokenAmountFromPlank | undefined>(undefined)
