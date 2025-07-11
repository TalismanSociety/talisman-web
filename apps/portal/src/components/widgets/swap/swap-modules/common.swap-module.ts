/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BaseWallet } from '@polkadot-onboard/core'
import type { Signer, SubmittableExtrinsic } from '@polkadot/api/types'
import type { Atom, Getter, SetStateAction, Setter } from 'jotai'
import type { TransactionRequest, WalletClient } from 'viem'
import { ApiPromise } from '@polkadot/api'
import { isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { evmErc20TokenId, evmNativeTokenId, subNativeTokenId } from '@talismn/balances'
import BigNumber from 'bignumber.js'
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage, unstable_withStorageValidator } from 'jotai/utils'
import { Loadable } from 'jotai/vanilla/utils/loadable'
import { firstValueFrom, Subject } from 'rxjs'
import { isAddress } from 'viem'

import { isBtcAddress } from '@/util/btc'
import { Decimal } from '@/util/Decimal'

export type SupportedSwapProtocol = 'chainflip' | 'simpleswap' | 'lifi' | 'stealthex'

export type SwappableAssetBaseType<TContext = Partial<Record<SupportedSwapProtocol, any>>> = {
  id: string
  name: string
  symbol: string
  chainId: number | string
  contractAddress?: string
  assetHubAssetId?: string
  image?: string
  networkType: 'evm' | 'substrate' | 'btc'
  /** protocol modules can store context here, like any special identifier */
  context: TContext
  decimals?: number
}

export type SwappableAssetWithDecimals<TContext = Partial<Record<SupportedSwapProtocol, any>>> = {
  decimals: number
} & SwappableAssetBaseType<TContext>

export type QuoteFee = {
  name: string
  amount: BigNumber
  tokenId: string
}

export type BaseQuote<TData = any> = {
  decentralisationScore: number
  protocol: SupportedSwapProtocol
  subProtocol?: string
  outputAmountBN: bigint
  inputAmountBN: bigint
  error?: string
  fees: QuoteFee[]
  talismanFee?: number
  data?: TData
  timeInSec: number
  providerLogo: string
  providerName: string
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
  depositRes?: {
    chainId: string | number
    extrinsicId?: string
    txHash?: string
    error?: string
  }
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

export type QuoteFunction<TData = any> = Atom<
  Loadable<Promise<BaseQuote<TData> | Loadable<Promise<BaseQuote<TData> | null>>[] | null>>
>
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
  approvalAtom?: Atom<{
    contractAddress: string
    amount: bigint
    tokenAddress: string
    chainId: number
    fromAddress: string
    protocolName: string
  } | null>
}

// atoms shared between swap modules

export const validateAddress = (address: string, networkType: 'evm' | 'substrate' | 'btc') => {
  switch (networkType) {
    case 'evm':
      return isAddress(address)
    case 'substrate':
      return isSubstrateAddress(address)
    case 'btc':
      return isBtcAddress(address)
    default:
      throw new Error('Invalid network type')
  }
}

export const selectedProtocolAtom = atom<SupportedSwapProtocol | null>(null)
export const selectedSubProtocolAtom = atom<string | undefined>(undefined)
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
export const toBtcAddressAtom = atom<string | null>(null)

export const toAddressAtom = atom(get => {
  const toAsset = get(toAssetAtom)
  const evmAddress = get(toEvmAddressAtom)
  const substrateAddress = get(toSubstrateAddressAtom)
  const btcAddress = get(toBtcAddressAtom)
  if (!toAsset) return null
  switch (toAsset.networkType) {
    case 'evm':
      return evmAddress
    case 'substrate':
      return substrateAddress
    case 'btc':
      return btcAddress
    default:
      return null
  }
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
  chainType: 'substrate' | 'evm' | 'btc',
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
    case 'btc':
      return 'btc-native'
    default:
      return 'not-supported'
  }
}

export const saveAddressForQuest = async (swapId: string, fromAddress: string, provider: string) => {
  const api = import.meta.env.VITE_QUEST_API
  if (!api) return
  await fetch(`${api}/api/quests/swap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ swapId, fromAddress, provider }),
  })
}

const handleTokenError = (tokenError: any) => {
  switch (tokenError.type) {
    case 'FundsUnavailable':
      return 'Funds are unavailable.'
    case 'OnlyProvider':
      return 'Account that must exist would die'
    case 'BelowMinimum':
      return 'Account cannot exist with the funds that would be given'
    case 'CannotCreate':
      return 'Account cannot be created'
    case 'UnknownAsset':
      return 'The asset in question is unknown'
    case 'Frozen':
      return 'Funds exist but are frozen'
    case 'Unsupported':
      return 'Operation is not supported by the asset'
    case 'CannotCreateHold':
      return 'Account cannot be created for recording amount on hold'
    case 'NotExpendable':
      return 'Account that is desired to remain would die'
    case 'Blocked':
      return 'Account cannot receive the assets'
    default:
      return tokenError.type
  }
}

export const substrateAssetsSwapTransfer = async (
  api: ApiPromise,
  allowReap = false,
  recipient: string,
  sender: string,
  assetId: string,
  amount: bigint | string,
  signer: Signer
) => {
  const transfer = allowReap
    ? api.tx.assets['transferAllowDeath'] ?? api.tx.assets['transfer']
    : api.tx.assets['transferKeepAlive']
  return substrateSwapTransfer(transfer(assetId, recipient, amount), sender, signer)
}

export const substrateNativeSwapTransfer = async (
  api: ApiPromise,
  allowReap = false,
  recipient: string,
  sender: string,
  amount: bigint | string,
  signer: Signer
) => {
  const transfer = allowReap
    ? api.tx.balances['transferAllowDeath'] ?? api.tx.balances['transfer']
    : api.tx.balances['transferKeepAlive']
  return substrateSwapTransfer(transfer(recipient, amount), sender, signer)
}

const substrateSwapTransfer = async (tx: SubmittableExtrinsic<'promise'>, sender: string, signer: Signer) => {
  const done = new Subject<{ id: string; ok: boolean; error?: string }>()

  const abort = new AbortController()
  let unsub: () => void
  abort.signal.onabort = () => unsub?.()

  try {
    unsub = await tx.signAndSend(sender, { signer, withSignedTransaction: true }, result => {
      let id: string = result.txHash.toHex()
      const blockNumber = (result as any).blockNumber.toNumber() as number
      // if block blockNumber and txIndex exists, use them as id
      if (blockNumber !== undefined && result.txIndex !== undefined) id = `${blockNumber}-${result.txIndex}`

      if (result.isError) {
        const error = result.dispatchError?.isToken
          ? handleTokenError(result.dispatchError.asToken)
          : result.dispatchError?.asModule
          ? result.dispatchError.asModule.registry.findMetaError(result.dispatchError.asModule).docs.join('')
          : 'Unknown error.'
        done.next({ id, ok: false, error })
      }

      if (result.status.isInBlock || result.status.isFinalized) {
        done.next({ id, ok: true })
      }
    })
  } catch (cause) {
    done.error(cause)
  }

  try {
    return await firstValueFrom(done)
  } finally {
    abort.abort()
  }
}
