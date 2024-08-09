import { knownEvmNetworksAtom } from './helpers'
import { swapInfoTabAtom } from './side-panel'
import { chainflipSwapModule, type ChainflipSwapActivityData } from './swap-modules/chainflip.swap-module'
import {
  fromAmountAtom,
  fromAssetAtom,
  swappingAtom,
  swapQuoteRefresherAtom,
  swapsAtom,
  toAssetAtom,
  type BaseQuote,
  type SwappableAssetBaseType,
  type EstimateGasTx,
  type SupportedSwapProtocol,
  type SwapActivity,
  SwappableAssetWithDecimals,
} from './swap-modules/common.swap-module'
import { simpleswapSwapModule } from './swap-modules/simpleswap-swap-module'
import { substrateApiState } from '@/domains/common'
import { connectedSubstrateWalletState } from '@/domains/extension'
import { useSubstrateEstimateGas } from '@/hooks/useSubstrateEstimateGas'
import { tokensByIdAtom, useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { toast } from '@talismn/ui'
import { atom, useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { loadable, useAtomCallback } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { deepEqual, useEstimateGas, useGasPrice, useWalletClient } from 'wagmi'

const swapModules = [chainflipSwapModule, simpleswapSwapModule]

/**
 * Unify all tokens we support for swapping on the UI
 * Note that this list is just to get the tokens we display initially on the UI
 * Users should later be able to paste any arbitrary address to swap any token
 * This will happen when we support other protocols like uniswap, sushiswap, etc
 *  */
export const fromAssetsAtom = atom(async get => {
  const allTokensSelector = swapModules.map(module => module.fromAssetsSelector)
  const knownEvmTokens = await get(knownEvmNetworksAtom)
  const otherKnownTokens = await get(tokensByIdAtom)
  const tokens = (await Promise.all(allTokensSelector.map(get))).flat()
  const tokensByChains = tokens.reduce((acc, cur) => {
    const tokens = acc[cur.chainId.toString()] ?? {}
    const tokenDetails = knownEvmTokens[cur.chainId.toString()]?.tokens[cur.id] ?? otherKnownTokens[cur.id]
    if (!tokenDetails) return acc
    tokens[cur.id] = {
      ...cur,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
      context: {
        ...tokens[cur.id]?.context,
        ...cur.context,
      },
    }
    acc[cur.chainId.toString()] = tokens
    return acc
  }, {} as Record<string, Record<string, SwappableAssetWithDecimals>>)

  // TODO: Fetch balances here for each chain if from account is selected
  const allTokens = Object.values(tokensByChains)
    .map(tokens => Object.values(tokens))
    .flat()

  return allTokens
})

export const toAssetsAtom = atom(async get => {
  const fromAsset = get(fromAssetAtom)

  // only select from the protocols that fromAsset support
  const allTokensSelector = swapModules
    .filter(m => (fromAsset ? fromAsset.context[m.protocol] : true))
    .map(module => module.toAssetsSelector)

  const knownEvmTokens = await get(knownEvmNetworksAtom)
  const otherKnownTokens = await get(tokensByIdAtom)
  const tokens = (await Promise.all(allTokensSelector.map(get))).flat()
  const tokensByChains = tokens.reduce((acc, cur) => {
    const tokens = acc[cur.chainId.toString()] ?? {}
    const tokenDetails = knownEvmTokens[cur.chainId.toString()]?.tokens[cur.id] ?? otherKnownTokens[cur.id]
    if (!tokenDetails) return acc
    tokens[cur.id] = {
      ...cur,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
    }
    acc[cur.chainId.toString()] = tokens
    return acc
  }, {} as Record<string, Record<string, SwappableAssetWithDecimals>>)

  // TODO: Fetch balances here for each chain if from account is selected
  const allTokens = Object.values(tokensByChains)
    .map(tokens => Object.values(tokens))
    .flat()
  return allTokens
})

export const swapQuotesAtom = loadable(
  atom(async (get): Promise<(BaseQuote & { decentralisationScore: number })[] | null> => {
    const fromAsset = get(fromAssetAtom)
    const allQuoters = swapModules
      .filter(m => (fromAsset ? fromAsset.context[m.protocol] : true))
      .map(module => module.quote)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)

    // force refresh
    get(swapQuoteRefresherAtom)

    // nothing to quote
    if (!fromAsset || !toAsset || !fromAmount.planck) return null

    const allQuotes = await Promise.all(allQuoters.map(quoter => quoter(get)))
    return allQuotes
      .filter(a => !!a)
      .map(a => ({
        ...a,
        decentralisationScore: swapModules.find(m => m.protocol === a.protocol)?.decentralisationScore ?? 0,
      }))
    // const bestQuote = allQuotes.reduce((best, next): BaseQuote | null => {
    //   if (!best) return next // return whatever next quote is if best is null
    //   if (!next) return best // return best if nothing to compare in next
    //   if (best.outputAmountBN === undefined) return next ?? best
    //   if (next.outputAmountBN === undefined) return best
    //   return next.outputAmountBN > best.outputAmountBN ? next : best
    // }, null)

    // if (!bestQuote || bestQuote.error)
    //   throw new Error(bestQuote?.error ? bestQuote.error : 'No available path. Please try another asset ')

    // return bestQuote
  })
)

/**
 * Get the best quote across all swap modules
 * Each module has their own quoter logic
 */
export const swapQuoteAtom = loadable(
  atom(async (get): Promise<BaseQuote | null> => {
    const fromAsset = get(fromAssetAtom)
    const allQuoters = swapModules
      .filter(m => (fromAsset ? fromAsset.context[m.protocol] : true))
      .map(module => module.quote)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)

    // force refresh
    get(swapQuoteRefresherAtom)

    // nothing to quote
    if (!fromAsset || !toAsset || !fromAmount.planck) return null

    const allQuotes = await Promise.all(allQuoters.map(quoter => quoter(get)))
    const bestQuote = allQuotes.reduce((best, next): BaseQuote | null => {
      if (!best) return next // return whatever next quote is if best is null
      if (!next) return best // return best if nothing to compare in next
      if (best.outputAmountBN === undefined) return next ?? best
      if (next.outputAmountBN === undefined) return best
      return next.outputAmountBN > best.outputAmountBN ? next : best
    }, null)

    if (!bestQuote || bestQuote.error)
      throw new Error(bestQuote?.error ? bestQuote.error : 'No available path. Please try another asset ')

    return bestQuote
  })
)

export const toAmountAtom = atom(async get => {
  const _quote = get(swapQuoteAtom)
  if (_quote.state !== 'hasData') return null
  const quote = _quote.data
  const toAsset = get(toAssetAtom)
  if (!quote || quote.outputAmountBN === undefined || !toAsset) return null
  return Decimal.fromPlanck(quote.outputAmountBN, quote.decimals, { currency: toAsset.symbol })
})

export const useEstimateSwapGas = () => {
  const fromAsset = useAtomValue(fromAssetAtom)
  const [tx, setTx] = useState<EstimateGasTx | null>(null)
  const quoteLoadable = useAtomValue(swapQuoteAtom)
  const gasPrice = useGasPrice(tx?.type === 'evm' ? { chainId: tx.chainId } : { chainId: 1 })
  const evmGas = useEstimateGas(
    tx?.type === 'evm'
      ? {
          ...tx.tx,
          query: {
            enabled: !!tx && tx.type === 'evm',
          },
        }
      : undefined
  )

  const { gas: substrateGas, refetch } = useSubstrateEstimateGas(tx?.type === 'substrate' ? tx : undefined)

  const getSubstrateApi = useRecoilCallback(
    ({ snapshot }) =>
      (rpc: string) =>
        snapshot.getPromise(substrateApiState(rpc))
  )

  const estimateGas = useAtomCallback(
    useCallback(
      get => {
        if (quoteLoadable.state !== 'hasData') return null
        const module = swapModules.find(module => module.protocol === quoteLoadable.data?.protocol)
        if (!module) return null
        return module.getEstimateGasTx(get, { getSubstrateApi })
      },
      [getSubstrateApi, quoteLoadable]
    )
  )

  // invalidate tx when fromAsset changes to re-trigger estimate gas
  useEffect(() => {
    setTx(null)
    refetch()
  }, [fromAsset, refetch])

  useEffect(() => {
    if (tx || !fromAsset) return
    const estimateGasPromise = estimateGas()
    if (!estimateGasPromise) return
    estimateGasPromise.then(newTx => {
      if (!deepEqual(newTx, tx)) setTx(newTx)
    })
  }, [estimateGas, fromAsset, tx])

  return useMemo(() => {
    if (!tx) return null
    if (tx.type === 'evm') {
      if (gasPrice.data === undefined) return null
      let gasUsage = evmGas.data
      // default to 80k gas if estimate gas fails (e.g. user has insufficient balance to estimate gas)
      if (gasUsage === undefined && !evmGas.isLoading && evmGas.error?.name === 'EstimateGasExecutionError')
        gasUsage = 80000n
      // TODO: support other evm gas tokens by not hardcoding decimals and currency
      if (gasUsage !== undefined) return Decimal.fromPlanck(gasPrice.data * gasUsage, 18, { currency: 'ETH' })
      return null
    } else return substrateGas ?? null
  }, [evmGas, gasPrice.data, substrateGas, tx])
}

export const useSwap = () => {
  const { data: walletClient } = useWalletClient()
  const swapping = useAtomValue(swappingAtom)
  const substrateWallet = useRecoilValue(connectedSubstrateWalletState)
  const _swaps = useAtomValue(swapsAtom)
  const getSubstrateApi = useRecoilCallback(
    ({ snapshot }) =>
      (rpc: string) =>
        snapshot.getPromise(substrateApiState(rpc))
  )

  const swap = useAtomCallback(
    useCallback(
      async (get, set, protocol: SupportedSwapProtocol, allowReap = false) => {
        try {
          set(swappingAtom, true)
          const toAmount = await get(toAmountAtom)
          const module = swapModules.find(module => module.protocol === protocol)
          // just a safety measure, this should never happen
          if (!module) throw new Error('Invalid protocol. This is likely a bug')
          const swapped = await module.swap(get, set, {
            evmWalletClient: walletClient,
            substrateWallet,
            getSubstrateApi,
            toAmount,
            allowReap,
          })
          //  TODO: instead of just getting "swapped: boolean"
          // we should handle adding swap to activity generically so that
          // all swaps across different protocols can appear in the activity list
          const now = new Date().getTime()

          set(swapsAtom, [..._swaps, { ...swapped, timestamp: now }])
          set(swapInfoTabAtom, 'activities')
          set(fromAmountAtom, Decimal.fromPlanck(0n, 1))
        } catch (e) {
          console.error(e)
          const error = e as any
          toast.error(error?.shortMessage ?? error?.details ?? error.message ?? 'unknown error')
        } finally {
          set(swappingAtom, false)
        }
      },
      [_swaps, getSubstrateApi, substrateWallet, walletClient]
    )
  )

  return { swap, swapping }
}

// utility hooks

export const useReverse = () => {
  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)
  const toAmount = useAtomValue(loadable(toAmountAtom))
  const setFromAmount = useSetAtom(fromAmountAtom)

  return useCallback(() => {
    if (toAmount.state === 'hasData' && toAmount.data) {
      setFromAmount(toAmount.data)
    }
    setFromAsset(toAsset)
    setToAsset(fromAsset)
  }, [fromAsset, setFromAmount, setFromAsset, setToAsset, toAmount, toAsset])
}

export const useAssetToken = (assetAtom: PrimitiveAtom<SwappableAssetBaseType | null>) => {
  const asset = useAtomValue(assetAtom)
  const tokens = useTokens()

  return useMemo(() => {
    if (!asset) return null
    const token = tokens[asset.id]
    if (!token) return null
    return {
      ...token,
      isEvm: token.type === 'evm-erc20' || token.type === 'evm-native' || token.type === 'evm-uniswapv2',
    }
  }, [asset, tokens])
}

export const useSyncPreviousChainflipSwaps = () => {
  const setSwaps = useSetAtom(swapsAtom)

  const sync = useCallback(() => {
    const previousSwaps = window.localStorage.getItem('@talisman/swap/chainflip/mainnet/swap-ids')
    if (!previousSwaps) return
    const swaps = JSON.parse(previousSwaps)
    if (!Array.isArray(swaps)) return

    const newSwaps: SwapActivity<ChainflipSwapActivityData>[] = []
    swaps.forEach(a => {
      if (typeof a.id === 'string' && (typeof a.date === 'string' || typeof a.date === 'number')) {
        const date = new Date(a.date)

        newSwaps.push({
          data: {
            id: a.id as string,
            network: 'mainnet',
          },
          protocol: 'chainflip',
          timestamp: date.getTime(),
        })
      }
    })
    setSwaps(prev => [...prev, ...newSwaps])
    window.localStorage.removeItem('@talisman/swap/chainflip/mainnet/swap-ids')
  }, [setSwaps])

  useEffect(() => {
    sync()
  }, [sync])
}

export const selectCustomAddressAtom = atom(false)
