import type { BaseWallet } from '@polkadot-onboard/core'
import { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { evmErc20TokenId, evmNativeTokenId, subNativeTokenId } from '@talismn/balances'
import { Decimal } from '@talismn/math'
import { type Atom, atom, type Getter, type SetStateAction, type Setter } from 'jotai'
import { atomWithStorage, createJSONStorage, unstable_withStorageValidator } from 'jotai/utils'
import 'recoil'
import type { TransactionRequest, WalletClient } from 'viem'

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
  talismanFeeBps?: number
  data?: any
}

type SwapProps = {
  evmWalletClient?: WalletClient
  substrateWallet?: BaseWallet
  getSubstrateApi: (rpc: string) => Promise<ApiPromise>
  allowReap?: boolean
  toAmount: Decimal | null
}

export type SwapActivity<TData> = {
  protocol: SupportedSwapProtocol
  timestamp: number
  data: TData
}

export type EstimateGasTx =
  | {
      type: 'evm'
      chainId: number
      tx: TransactionRequest
    }
  | {
      type: 'substrate'
      fromAddress: string
      tx: SubmittableExtrinsic<'promise'>
    }

export type QuoteFunction = (get: Getter) => Promise<BaseQuote | null>
export type SwapFunction<TData> = (
  get: Getter,
  set: Setter,
  props: SwapProps
) => Promise<Omit<SwapActivity<TData>, 'timestamp'>>
export type GetEstimateGasTxFunction = (
  get: Getter,
  props: { getSubstrateApi: (rpc: string) => Promise<ApiPromise> }
) => Promise<EstimateGasTx | null>

export type SwapModule = {
  protocol: SupportedSwapProtocol
  tokensSelector: Atom<Promise<CommonSwappableAssetType[]>>
  quote: QuoteFunction
  getEstimateGasTx: GetEstimateGasTxFunction
  /** Returns whether the swap succeeded or not */
  swap: SwapFunction<any>
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
export const swappingAtom = atom(false)
export const swapQuoteRefresherAtom = atom(new Date().getTime())

// swaps history related atoms

type StoredSwaps = SwapActivity<any>[]

const validateSwaps = (value: unknown): value is StoredSwaps => {
  if (!Array.isArray(value)) return false
  for (const swap of value) {
    if (typeof swap?.protocol !== 'string' || typeof swap?.timestamp !== 'number' || !swap?.data) return false
  }
  return true
}

const _swapsStorage = unstable_withStorageValidator(validateSwaps)(
  createJSONStorage(() => globalThis.localStorage, {
    reviver: (key, value) => {
      if (key === 'timestamp' && typeof value === 'number') new Date(value)
      return value
    },
  })
)

const filterAndSortStoredSwaps = (swaps: StoredSwaps) => swaps.toSorted((a, b) => b.timestamp - a.timestamp)

const swapsStorage: typeof _swapsStorage = {
  ..._swapsStorage,
  getItem: (key, initialValue) => filterAndSortStoredSwaps(_swapsStorage.getItem(key, initialValue)),
  setItem: (key, newValue) => _swapsStorage.setItem(key, filterAndSortStoredSwaps(newValue)),
}

const swapsStorageAtom = atomWithStorage('@talisman/swaps', [], swapsStorage)

export const swapsAtom = atom(
  get => filterAndSortStoredSwaps(get(swapsStorageAtom)),
  (_, set, swaps: SetStateAction<StoredSwaps>) => set(swapsStorageAtom, swaps)
)

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
