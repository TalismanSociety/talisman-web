import { swapInfoTabAtom } from './side-panel'
import { chainflipSwapModule, type ChainflipSwapActivityData } from './swap-modules/chainflip.swap-module'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  swappingAtom,
  swapQuoteRefresherAtom,
  swapsAtom,
  toAddressAtom,
  toAssetAtom,
  type BaseQuote,
  type CommonSwappableAssetType,
  type EstimateGasTx,
  type SupportedSwapProtocol,
  type SwapActivity,
} from './swap-modules/common.swap-module'
import { evmSignableAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { getCoinGeckoErc20Coin } from '@/domains/balances/coingecko'
import { substrateApiState } from '@/domains/common'
import { connectedSubstrateWalletState } from '@/domains/extension'
import { useSetCustomTokens, type CustomTokensConfig } from '@/hooks/useSetCustomTokens'
import { useSubstrateEstimateGas } from '@/hooks/useSubstrateEstimateGas'
import { tokensByIdAtom, useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { toast } from '@talismn/ui'
import { atom, useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { loadable, useAtomCallback } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { isAddress } from 'viem'
import { deepEqual, useEstimateGas, useGasPrice, useWalletClient } from 'wagmi'

const swapModules = [chainflipSwapModule]

/**
 * Unify all tokens we support for swapping on the UI
 * Note that this list is just to get the tokens we display initially on the UI
 * Users should later be able to paste any arbitrary address to swap any token
 * This will happen when we support other protocols like uniswap, sushiswap, etc
 *  */
export const swappableTokensAtom = atom(async get => {
  const allTokensSelector = swapModules.map(module => module.tokensSelector)
  const tokens = (await Promise.all(allTokensSelector.map(get))).flat()

  // make sure each token is only displayed in the list once
  return tokens.filter((token, index) => tokens.findIndex(t => t.id === token.id) === index)
})

/**
 * Get the best quote across all swap modules
 * Each module has their own quoter logic
 */
export const swapQuoteAtom = loadable(
  atom(async (get): Promise<BaseQuote | null> => {
    const allQuoters = swapModules.map(module => module.quote)
    const fromAsset = get(fromAssetAtom)
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
  return Decimal.fromPlanck(quote.outputAmountBN, toAsset.decimals, { currency: toAsset.symbol })
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
          set(fromAmountInputAtom, '')
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
  const setFromAmountInput = useSetAtom(fromAmountInputAtom)

  return useCallback(() => {
    if (toAmount.state === 'hasData' && toAmount.data) {
      setFromAmountInput(Decimal.fromPlanck(toAmount.data.planck, toAmount.data.decimals).toString())
    }
    setFromAsset(toAsset)
    setToAsset(fromAsset)
  }, [fromAsset, setFromAmountInput, setFromAsset, setToAsset, toAmount, toAsset])
}

export const useAssetToken = (assetAtom: PrimitiveAtom<CommonSwappableAssetType | null>) => {
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

export const missingTokensAtom = atom(async (get): Promise<CustomTokensConfig> => {
  const allAssets = await get(swappableTokensAtom)
  const tokens = await get(tokensByIdAtom)

  // only the following type of assets can be added as custom token
  // - evm chains
  // - erc20 tokens
  const evmAssetsMissingInTokens = allAssets.filter(
    a => !tokens[a.id] && a.id.split('-')[1] === 'evm' && !!a.contractAddress
  )

  if (evmAssetsMissingInTokens.length === 0) return []

  // get coingecko data
  const coingeckoData = await Promise.allSettled(
    evmAssetsMissingInTokens.map(async a => await getCoinGeckoErc20Coin(a.chainId.toString(), a.contractAddress!))
  )

  return evmAssetsMissingInTokens.map((a, index) => {
    const coingeckoRes = coingeckoData[index]
    const coingecko = coingeckoRes?.status === 'fulfilled' ? coingeckoRes.value : null
    return {
      contractAddress: a.contractAddress!,
      decimals: a.decimals,
      evmChainId: a.chainId.toString(),
      symbol: a.symbol,
      coingeckoId: coingecko?.id,
      logo: coingecko?.image.large,
    }
  })
})

export const useLoadTokens = () => {
  const missingTokens = useAtomValue(loadable(missingTokensAtom))

  const tokensToSet = useMemo((): CustomTokensConfig => {
    if (missingTokens.state !== 'hasData') return []
    return missingTokens.data
  }, [missingTokens])

  useSetCustomTokens(tokensToSet)
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

export const useAccountsController = () => {
  const [fromAddress, setFromAddress] = useAtom(fromAddressAtom)
  const [toAddress, setToAddress] = useAtom(toAddressAtom)
  const fromAsset = useAtomValue(fromAssetAtom)
  const toAsset = useAtomValue(toAssetAtom)
  const evmAccounts = useRecoilValue(evmSignableAccountsState)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const [selectCustomAddress, setSelectCustomAddress] = useAtom(selectCustomAddressAtom)

  // handle selecting default account
  useEffect(() => {
    if (!fromAsset) {
      setFromAddress(null)
    } else {
      if (fromAsset.id.split('-')[1] === 'evm') {
        const defaultEvmAccount = evmAccounts[0]
        if (!fromAddress || !isAddress(fromAddress)) setFromAddress(defaultEvmAccount?.address ?? null)
      } else {
        const defaultSubstrateAccount = substrateAccounts[0]
        if (!fromAddress || isAddress(fromAddress)) setFromAddress(defaultSubstrateAccount?.address ?? null)
      }
    }
  }, [evmAccounts, fromAddress, fromAsset, setFromAddress, substrateAccounts])

  useEffect(() => {
    if (!toAsset) {
      setToAddress(null)
    } else if (!selectCustomAddress) {
      if (toAsset.id.split('-')[1] === 'evm') {
        const defaultEvmAccount = evmAccounts[0]
        const defaultAddress = fromAsset?.id.split('-')[1] === 'evm' ? fromAddress : defaultEvmAccount?.address
        if (!toAddress || !isAddress(toAddress)) setToAddress(defaultAddress ?? null)
      } else {
        const defaultSubstrateAccount = substrateAccounts[0]
        const defaultAddress = fromAsset?.id.split('-')[1] !== 'evm' ? fromAddress : defaultSubstrateAccount?.address
        if (!toAddress || isAddress(toAddress)) setToAddress(defaultAddress ?? null)
      }
    }
  }, [
    evmAccounts,
    fromAddress,
    fromAsset?.id,
    selectCustomAddress,
    setToAddress,
    substrateAccounts,
    toAddress,
    toAsset,
  ])

  useEffect(() => {
    if (toAddress?.toLowerCase() === fromAddress?.toLowerCase()) setSelectCustomAddress(false)
  }, [fromAddress, setSelectCustomAddress, toAddress])
}
