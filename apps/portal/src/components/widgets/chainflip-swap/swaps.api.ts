import { substrateApiGetterAtom } from '../../../domains/common/recoils/api'
import { popularTokens } from './curated-tokens'
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
  type SupportedSwapProtocol,
  type SwapActivity,
  SwappableAssetWithDecimals,
  selectedProtocolAtom,
  quoteSortingAtom,
  fromEvmAddressAtom,
  fromSubstrateAddressAtom,
  toEvmAddressAtom,
  toSubstrateAddressAtom,
} from './swap-modules/common.swap-module'
import { simpleswapSwapModule } from './swap-modules/simpleswap-swap-module'
import { wagmiAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts'
import { substrateApiState } from '@/domains/common'
import { connectedSubstrateWalletState } from '@/domains/extension'
import { tokenRatesAtom, tokensByIdAtom, useTokens } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { toast } from '@talismn/ui'
import { Atom, atom, Getter, useAtom, useAtomValue, useSetAtom, type PrimitiveAtom } from 'jotai'
import { loadable, useAtomCallback } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { useWalletClient } from 'wagmi'

const swapModules = [chainflipSwapModule, simpleswapSwapModule]
const ETH_LOGO = 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/eth.svg'

const getTokensByChainId = async (
  get: Getter,
  allTokensSelector: Atom<Promise<SwappableAssetBaseType<Partial<Record<SupportedSwapProtocol, any>>>[]>>[]
) => {
  const knownEvmTokens = await get(knownEvmNetworksAtom)
  const otherKnownTokens = await get(tokensByIdAtom)
  const tokens = (await Promise.all(allTokensSelector.map(get))).flat()
  return tokens.reduce((acc, cur) => {
    const tokens = acc[cur.chainId.toString()] ?? {}
    const tokenDetails = knownEvmTokens[cur.chainId.toString()]?.tokens[cur.id] ?? otherKnownTokens[cur.id]
    if (!tokenDetails) return acc
    tokens[cur.id] = {
      ...cur,
      symbol: tokenDetails.symbol,
      decimals: tokenDetails.decimals,
      image: tokenDetails.symbol.toLowerCase() === 'eth' ? ETH_LOGO : cur.image,
      context: {
        ...tokens[cur.id]?.context,
        ...cur.context,
      },
    }
    acc[cur.chainId.toString()] = tokens
    return acc
  }, {} as Record<string, Record<string, SwappableAssetWithDecimals>>)
}

export const tokenTabs: {
  value: string
  label: string
  filter?: (token: SwappableAssetWithDecimals) => boolean
  sort?: (a: SwappableAssetWithDecimals, b: SwappableAssetWithDecimals) => number
}[] = [
  {
    value: 'popular',
    label: 'Popular',
    filter: token => popularTokens.includes(token.id) ?? false,
    sort: (a, b) => popularTokens.indexOf(a.id) - popularTokens.indexOf(b.id),
  },
]

export const tokenTabAtom = atom<string>('popular')
/**
 * Unify all tokens we support for swapping on the UI
 * Note that this list is just to get the tokens we display initially on the UI
 * Users should later be able to paste any arbitrary address to swap any token
 * This will happen when we support other protocols like uniswap, sushiswap, etc
 *  */
export const fromAssetsAtom = atom(async get => {
  const allTokensSelector = swapModules.map(module => module.fromAssetsSelector)
  const tokensByChains = await getTokensByChainId(get, allTokensSelector)

  let tokens = Object.values(tokensByChains)
    .map(tokens =>
      Object.values(tokens).sort((a, b) => a.symbol.replaceAll('$', '').localeCompare(b.symbol.replaceAll('$', '')))
    )
    .flat()

  const tab = get(tokenTabAtom)
  const filter = tokenTabs.find(t => t.value === tab)?.filter
  const sort = tokenTabs.find(t => t.value === tab)?.sort
  if (filter) tokens = tokens.filter(filter)
  if (sort) tokens = tokens.sort(sort)
  return tokens
})

export const toAssetsAtom = atom(async get => {
  const fromAsset = get(fromAssetAtom)

  // only select from the protocols that fromAsset support
  const allTokensSelector = swapModules
    .filter(m => (fromAsset ? fromAsset.context[m.protocol] : true))
    .map(module => module.toAssetsSelector)

  const tokensByChains = await getTokensByChainId(get, allTokensSelector)
  let tokens = Object.values(tokensByChains)
    .map(tokens =>
      Object.values(tokens).sort((a, b) => a.symbol.replaceAll('$', '').localeCompare(b.symbol.replaceAll('$', '')))
    )
    .flat()

  const tab = get(tokenTabAtom)
  const filter = tokenTabs.find(t => t.value === tab)?.filter
  const sort = tokenTabs.find(t => t.value === tab)?.sort
  if (filter) tokens = tokens.filter(filter)
  if (sort) tokens = tokens.sort(sort)

  // temp solution to disable eth <> arb routes
  if (fromAsset) {
    if (fromAsset.chainId.toString() === '1' || fromAsset.chainId.toString() === '42161') {
      tokens = tokens.filter(t => t.chainId.toString() !== '1' && t.chainId.toString() !== '42161')
    }
  }
  return tokens
})

export const swapQuotesAtom = loadable(
  atom(async (get): Promise<(BaseQuote & { decentralisationScore: number })[] | null> => {
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const allQuoters = swapModules
      .filter(m => (fromAsset && toAsset ? toAsset.context[m.protocol] && fromAsset.context[m.protocol] : true))
      .map(module => module.quote)
    const fromAmount = get(fromAmountAtom)
    const substrateApiGetter = get(substrateApiGetterAtom)

    // force refresh
    get(swapQuoteRefresherAtom)

    // nothing to quote
    if (!fromAsset || !toAsset || !fromAmount.planck || !substrateApiGetter) return null

    const allQuotes = await Promise.all(
      allQuoters.map(quoter => quoter(get, { getSubstrateApi: substrateApiGetter.getApi }))
    )
    const validQuotes = allQuotes
      .filter(a => !!a)
      .filter(a => a.outputAmountBN > 0n)
      .map(a => ({
        ...a,
        decentralisationScore: swapModules.find(m => m.protocol === a.protocol)?.decentralisationScore ?? 0,
      }))

    if (validQuotes.length === 0) {
      const quoteWithError = allQuotes.find(q => q?.error)
      if (quoteWithError) throw new Error(quoteWithError.error)
    }
    return validQuotes
  })
)

export const sortedQuotesAtom = atom(async get => {
  const quotes = get(swapQuotesAtom)
  const sort = get(quoteSortingAtom)
  const tokenRates = await get(tokenRatesAtom)

  if (quotes.state === 'hasError') throw quotes.error
  if (quotes.state !== 'hasData') return undefined
  return quotes.data
    ?.map(q => {
      const fees = q.fees.reduce((acc, fee) => {
        const rate = tokenRates[fee.tokenId]?.usd ?? 0
        return acc + fee.amount.toNumber() * rate
      }, 0)
      return {
        quote: q,
        fees,
      }
    })
    .sort((a, b) => {
      switch (sort) {
        case 'bestRate':
          return +(b.quote.outputAmountBN - a.quote.outputAmountBN).toString()
        case 'fastest':
          return a.quote.timeInSec - b.quote.timeInSec
        case 'cheapest':
          return a.fees - b.fees
        case 'decentalised':
          return b.quote.decentralisationScore - a.quote.decentralisationScore
        default:
          return 0
      }
    })
})

export const selectedQuoteAtom = atom(async get => {
  const quotes = await get(sortedQuotesAtom)
  const selectedProtocol = get(selectedProtocolAtom)
  if (!quotes) return null
  const quote = quotes.find(q => q.quote.protocol === selectedProtocol) ?? quotes[0]
  if (!quote) return null
  return quote
})

export const toAmountAtom = atom(async get => {
  const quote = await get(selectedQuoteAtom)
  if (!quote) return null

  const toAsset = get(toAssetAtom)
  if (!quote || quote.quote.outputAmountBN === undefined || !toAsset) return null
  return Decimal.fromPlanck(quote.quote.outputAmountBN, toAsset.decimals, { currency: toAsset.symbol })
})

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

export const useFromAccount = () => {
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccounts = useRecoilValue(wagmiAccountsState)

  const [fromEvmAddress, setFromEvmAddress] = useAtom(fromEvmAddressAtom)
  const [fromSubstrateAddress, setFromSubstrateAddress] = useAtom(fromSubstrateAddressAtom)

  const fromEvmAccount = useMemo(
    () => ethAccounts.find(a => a.address.toLowerCase() === fromEvmAddress?.toLowerCase()),
    [ethAccounts, fromEvmAddress]
  )
  const fromSubstrateAccount = useMemo(
    () => substrateAccounts.find(a => a.address.toLowerCase() === fromSubstrateAddress?.toLowerCase()),
    [fromSubstrateAddress, substrateAccounts]
  )

  useEffect(() => {
    if (!fromEvmAccount && ethAccounts.length > 0) setFromEvmAddress((ethAccounts[0]?.address as `0x${string}`) ?? null)
    if (!fromSubstrateAccount && substrateAccounts.length > 0)
      setFromSubstrateAddress(substrateAccounts[0]?.address ?? null)
  }, [ethAccounts, fromEvmAccount, fromSubstrateAccount, setFromEvmAddress, setFromSubstrateAddress, substrateAccounts])

  return { ethAccounts, substrateAccounts, fromEvmAccount, fromSubstrateAccount, fromEvmAddress, fromSubstrateAddress }
}

export const useToAccount = () => {
  const initiated = useRef(false)
  const substrateAccounts = useRecoilValue(writeableSubstrateAccountsState)
  const ethAccounts = useRecoilValue(wagmiAccountsState)

  const [toEvmAddress, setToEvmAddress] = useAtom(toEvmAddressAtom)
  const [toSubstrateAddress, setToSubstrateAddress] = useAtom(toSubstrateAddressAtom)

  const toEvmAccount = useMemo(
    () => ethAccounts.find(a => a.address.toLowerCase() === toEvmAddress?.toLowerCase()),
    [ethAccounts, toEvmAddress]
  )
  const toSubstrateAccount = useMemo(
    () => substrateAccounts.find(a => a.address.toLowerCase() === toSubstrateAddress?.toLowerCase()),
    [substrateAccounts, toSubstrateAddress]
  )

  useEffect(() => {
    if (initiated.current) return
    if (!toEvmAccount && ethAccounts.length > 0) setToEvmAddress((ethAccounts[0]?.address as `0x${string}`) ?? null)
    if (!toSubstrateAccount && substrateAccounts.length > 0)
      setToSubstrateAddress(substrateAccounts[0]?.address ?? null)
  }, [ethAccounts, setToEvmAddress, setToSubstrateAddress, substrateAccounts, toEvmAccount, toSubstrateAccount])

  useEffect(() => {
    if (toEvmAddress && toSubstrateAddress) initiated.current = true
  }, [toEvmAddress, toSubstrateAddress])
}
