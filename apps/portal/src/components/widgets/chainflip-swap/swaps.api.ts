import { chainflipSwapModule } from './swap-modules/chainflip.swap-module'
import {
  fromAmountAtom,
  fromAmountInputAtom,
  fromAssetAtom,
  toAssetAtom,
  type BaseQuote,
  type CommonSwappableAssetType,
  type SupportedSwapProtocol,
} from './swap-modules/common.swap-module'
import { useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { atom, useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { loadable, useAtomCallback } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

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
export const swapQuoteAtom = atom(async (get): Promise<BaseQuote | null> => {
  const allQuoters = swapModules.map(module => module.quote)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)

  // nothing to quote
  if (!fromAsset || !toAsset || !fromAmount.planck) return null

  const allQuotes = await Promise.all(allQuoters.map(get))
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

export const useSwap = () => {
  return useAtomCallback(
    useCallback(async (get, set, protocol: SupportedSwapProtocol) => {
      const module = swapModules.find(module => module.protocol === protocol)
      if (!module) return false
      return module.swap(get, set)
    }, [])
  )
}

export const toAmountAtom = atom(async get => {
  const quote = await get(swapQuoteAtom)
  const toAsset = get(toAssetAtom)
  if (!quote || quote.outputAmountBN === undefined || !toAsset) return null
  return Decimal.fromPlanck(quote.outputAmountBN, toAsset.decimals)
})

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
