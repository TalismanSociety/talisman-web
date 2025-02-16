import { atom } from 'jotai'

export const DEFAULT_MAX_SLIPPAGE = 5.5

export const bittensorSlippageAtom = atom<number>(0)

export const maxSlippageAtom = atom<number>(DEFAULT_MAX_SLIPPAGE)
