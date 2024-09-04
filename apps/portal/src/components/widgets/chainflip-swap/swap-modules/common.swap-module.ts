import type { BaseWallet } from '@polkadot-onboard/core'
import { ApiPromise } from '@polkadot/api'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { evmErc20TokenId, evmNativeTokenId, subNativeTokenId } from '@talismn/balances'
import { Decimal } from '@talismn/math'
import { type Atom, atom, type Getter, type SetStateAction, type Setter } from 'jotai'
import { atomWithStorage, createJSONStorage, unstable_withStorageValidator } from 'jotai/utils'
import 'recoil'
import type { TransactionRequest, WalletClient } from 'viem'

export type SupportedSwapProtocol = 'chainflip' | 'simpleswap'

export type SwappableAssetBaseType<TContext = Partial<Record<SupportedSwapProtocol, any>>> = {
  id: string
  name: string
  symbol: string
  chainId: number | string
  contractAddress?: string
  assetHubAssetId?: number
  image?: string
  networkType: 'evm' | 'substrate'
  /** protocol modules can store context here, like any special identifier */
  context: TContext
}

export type SwappableAssetWithDecimals<TContext = Partial<Record<SupportedSwapProtocol, any>>> = {
  decimals: number
} & SwappableAssetBaseType<TContext>

type QuoteFee = {
  name: string
  amount: Decimal
  tokenId: string
}

export type BaseQuote = {
  protocol: SupportedSwapProtocol
  outputAmountBN: bigint
  inputAmountBN: bigint
  error?: string
  fees: QuoteFee[]
  talismanFeeBps?: number
  data?: any
  timeInSec: number
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

export type QuoteFunction = (
  get: Getter,
  props: { getSubstrateApi: (rpc: string) => Promise<ApiPromise> }
) => Promise<BaseQuote | null>
export type SwapFunction<TData> = (
  get: Getter,
  set: Setter,
  props: SwapProps
) => Promise<Omit<SwapActivity<TData>, 'timestamp'>>
export type GetEstimateGasTxFunction = (
  get: Getter,
  props: { getSubstrateApi: (rpc: string) => Promise<ApiPromise> }
) => Promise<QuoteFee | null>

export type SwapModule = {
  protocol: SupportedSwapProtocol
  fromAssetsSelector: Atom<Promise<SwappableAssetBaseType[]>>
  toAssetsSelector: Atom<Promise<SwappableAssetBaseType[]>>
  quote: QuoteFunction
  /** Returns whether the swap succeeded or not */
  swap: SwapFunction<any>

  // talisman curated data
  decentralisationScore: number
}

// atoms shared between swap modules

export const selectedProtocolAtom = atom<SupportedSwapProtocol | null>(null)
export const fromAssetAtom = atom<SwappableAssetWithDecimals | null>(null)
export const fromAmountAtom = atom<Decimal>(Decimal.fromPlanck(0n, 1))
export const fromSubstrateAddressAtom = atom<string | null>(null)
export const fromEvmAddressAtom = atom<`0x${string}` | null>(null)
export const fromAddressAtom = atom(get => {
  const fromAsset = get(fromAssetAtom)
  const evmAddress = get(fromEvmAddressAtom)
  const substrateAddress = get(fromSubstrateAddressAtom)
  if (!fromAsset) return null
  return fromAsset.networkType === 'evm' ? evmAddress : substrateAddress
})

export const toAssetAtom = atom<SwappableAssetWithDecimals | null>(null)
export const toSubstrateAddressAtom = atom<string | null>(null)
export const toEvmAddressAtom = atom<`0x${string}` | null>(null)
export const toAddressAtom = atom(get => {
  const toAsset = get(toAssetAtom)
  const evmAddress = get(toEvmAddressAtom)
  const substrateAddress = get(toSubstrateAddressAtom)
  if (!toAsset) return null
  return toAsset.networkType === 'evm' ? evmAddress : substrateAddress
})

export const swappingAtom = atom(false)
export const quoteSortingAtom = atom<'decentalised' | 'cheapest' | 'fastest' | 'bestRate'>('bestRate')
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
