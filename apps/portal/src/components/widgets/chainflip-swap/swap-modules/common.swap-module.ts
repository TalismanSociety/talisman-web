import { evmErc20TokenId, evmNativeTokenId, subNativeTokenId } from '@talismn/balances'
import { Decimal } from '@talismn/math'
import { type Atom, atom, type Getter, type Setter } from 'jotai'

export type SupportedSwapProtocol = 'chainflip'

export type CommonSwappableAssetType = {
  id: string
  name: string
  symbol: string
  decimals: number
  contractAddress?: string
  chainId: number | string
}

export type BaseQuote = {
  protocol: SupportedSwapProtocol
  outputAmountBN?: bigint
  inputAmountBN: bigint
  error?: string
  fees: any
  data?: any
}

export type SwapModule = {
  protocol: SupportedSwapProtocol
  tokensSelector: Atom<Promise<CommonSwappableAssetType[]>>
  quote: Atom<Promise<BaseQuote | null>>
  /** Returns whether the swap succeeded or not */
  swap: (get: Getter, set: Setter) => Promise<boolean>
}

// atoms shared between swap modules

export const fromAssetAtom = atom<CommonSwappableAssetType | null>(null)
export const toAssetAtom = atom<CommonSwappableAssetType | null>(null)
export const fromAmountInputAtom = atom('')
export const fromAmountAtom = atom(get => {
  const input = get(fromAmountInputAtom)
  const asset = get(fromAssetAtom)
  if (!asset || input.trim() === '') return Decimal.fromUserInput(input, 1)
  return (
    Decimal.fromUserInputOrUndefined(input, asset.decimals, { currency: asset.symbol }) ?? Decimal.fromPlanck(0n, 1)
  )
})
export const fromAddressAtom = atom<string | null>(null)
export const toAddressAtom = atom<string | null>(null)
// helpers

export const getTokenIdForSwappableAsset = (
  chainType: 'substrate' | 'evm',
  chainId: number | string,
  contractAddress?: string
) => {
  switch (chainType) {
    case 'evm':
      return contractAddress
        ? evmErc20TokenId(chainId.toString(), contractAddress)
        : evmNativeTokenId(chainId.toString())
    case 'substrate':
      return subNativeTokenId(chainId.toString())
    default:
      return 'not-supported'
  }
}
