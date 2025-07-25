import type { PrimitiveAtom } from 'jotai'
import type { Chain as ViemChain } from 'viem/chains'
import * as sdk from '@lifi/sdk'
import { evmErc20TokenId } from '@talismn/balances'
import { tokenRatesAtom, tokensByIdAtom, useChains, useEvmNetworks, useTokens } from '@talismn/balances-react'
import { isEthereumAddress } from '@talismn/crypto'
import { toast } from '@talismn/ui/molecules/Toaster'
import BigNumber from 'bignumber.js'
import { Atom, atom, Getter, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atomFamily, loadable, useAtomCallback } from 'jotai/utils'
import { Loadable } from 'jotai/vanilla/utils/loadable'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { createPublicClient, erc20Abi, http, isAddress } from 'viem'
import { useWalletClient } from 'wagmi'

import { allEvmChains } from '@/components/widgets/swap/allEvmChains.ts'
import { wagmiAccountsState, writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { substrateApiGetterAtom, substrateApiState } from '@/domains/common/recoils/api'
import { connectedSubstrateWalletState } from '@/domains/extension/substrate'
import { Decimal } from '@/util/Decimal'

import type { ChainflipSwapActivityData } from './swap-modules/chainflip.swap-module'
import type {
  BaseQuote,
  SupportedSwapProtocol,
  SwapActivity,
  SwappableAssetBaseType,
} from './swap-modules/common.swap-module'
import { popularTokens, talismanTokens } from './curated-tokens'
import { knownEvmNetworksAtom } from './helpers'
import { swapInfoTabAtom } from './side-panel'
import { chainflipSwapModule } from './swap-modules/chainflip.swap-module'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  fromEvmAddressAtom,
  fromSubstrateAddressAtom,
  quoteSortingAtom,
  selectedProtocolAtom,
  selectedSubProtocolAtom,
  SwappableAssetWithDecimals,
  swappingAtom,
  swapQuoteRefresherAtom,
  swapsAtom,
  toAssetAtom,
  toBtcAddressAtom,
  toEvmAddressAtom,
  toSubstrateAddressAtom,
} from './swap-modules/common.swap-module'
import { lifiSwapModule } from './swap-modules/lifi.swap-module'
import { simpleswapSwapModule } from './swap-modules/simpleswap-swap-module'
import { stealthexSwapModule } from './swap-modules/stealthex-swap-module'

const coingeckoApiUrl = import.meta.env.VITE_COIN_GECKO_API
const coingeckoApiKey = import.meta.env.VITE_COIN_GECKO_API_KEY
const coingeckoTier = import.meta.env.VITE_COIN_GECKO_API_TIER

const swapModules = [chainflipSwapModule, simpleswapSwapModule, lifiSwapModule, stealthexSwapModule]
const ETH_LOGO = 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/eth.svg'
const BTC_LOGO = 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png?1696501400'
const btcTokens = {
  'btc-native': {
    symbol: 'BTC',
    decimals: 8,
    image: BTC_LOGO,
  },
}

const getTokensByChainId = async (
  get: Getter,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allTokensSelector: Atom<Promise<SwappableAssetBaseType<Partial<Record<SupportedSwapProtocol, any>>>[]>>[]
) => {
  const knownEvmTokens = await get(knownEvmNetworksAtom)
  const otherKnownTokens = await get(tokensByIdAtom)
  const tokens = (await Promise.all(allTokensSelector.map(get))).flat()
  return tokens.reduce((acc, cur) => {
    const tokens = acc[cur.chainId.toString()] ?? {}
    const tokenDetails =
      knownEvmTokens[cur.chainId.toString()]?.tokens[cur.id] ??
      otherKnownTokens[cur.id] ??
      btcTokens[cur.id as 'btc-native']

    const symbol = tokenDetails?.symbol ?? cur.symbol
    const decimals = tokenDetails?.decimals ?? cur.decimals
    const image = symbol?.toLowerCase() === 'eth' ? ETH_LOGO : cur.image
    if (!symbol || !decimals) return acc
    tokens[cur.id] = {
      ...cur,
      symbol,
      decimals,
      image,
      context: {
        ...tokens[cur.id]?.context,
        ...cur.context,
      },
    }
    acc[cur.chainId.toString()] = tokens
    return acc
  }, {} as Record<string, Record<string, SwappableAssetWithDecimals>>)
}

const getCoingeckoCategoryTokens = async (
  get: Getter,
  categoryId: string,
  tokens: SwappableAssetWithDecimals[]
): Promise<SwappableAssetWithDecimals[]> => {
  const platforms = await get(coingeckoAssetPlatformsAtom)
  const coinsList = await get(coingeckoListAtom)
  const coins = (await get(coingeckoCoinsByCategoryAtom(categoryId))) as {
    symbol: string
    id: string
    image?: string
  }[]
  return coins
    .map(c => {
      const coinPlatforms = Object.entries(coinsList.find(coin => coin.id === c.id)?.platforms ?? {})
      if (coinPlatforms.length === 0) {
        const token = tokens.find(t => t.symbol.toLowerCase() === c.symbol.toLowerCase())
        if (token && !token.image && c.image) token.image = c.image
        return token
      }

      return coinPlatforms.map(([platformId, address]) => {
        const platform = platforms.find(p => p.id === platformId)
        const token = tokens.find(
          t =>
            (t.networkType === 'evm' ? +t.chainId : t.chainId) === platform?.chain_identifier &&
            t.contractAddress?.toLowerCase() === address.toLowerCase()
        )
        if (token && !token.image && c.image) token.image = c.image
        return token
      })
    })
    .flat()
    .filter(c => !!c)
}

export const tokenTabs: {
  value: string
  label: string
  coingecko?: boolean
  filter?: (token: SwappableAssetWithDecimals) => boolean
  sort?: (a: SwappableAssetWithDecimals, b: SwappableAssetWithDecimals) => number
}[] = [
  {
    value: 'popular',
    label: '🔥 Popular',
    filter: token => popularTokens.includes(token.id) ?? false,
    sort: (a, b) => popularTokens.indexOf(a.id) - popularTokens.indexOf(b.id),
  },
  {
    value: 'talisman',
    label: 'Talisman',
    filter: token => talismanTokens.includes(token.id) ?? false,
    sort: (a, b) => talismanTokens.indexOf(a.id) - talismanTokens.indexOf(b.id),
  },
  {
    value: 'meme-token',
    label: 'Meme',
    coingecko: true,
  },
  {
    value: 'liquid-staking-tokens',
    label: 'LSTs',
    coingecko: true,
  },
  {
    value: 'artificial-intelligence',
    label: 'AI',
    coingecko: true,
  },
  {
    value: 'depin',
    label: 'DePIN',
    coingecko: true,
  },
  {
    value: 'decentralized-finance-defi',
    label: 'Defi',
    coingecko: true,
  },
  {
    value: 'layer-2',
    label: 'L2s',
    coingecko: true,
  },
]

export const tokenTabAtom = atom<string>('popular')
export const coingeckoAssetPlatformsAtom = atom(async () => {
  const response = await fetch(`${coingeckoApiUrl}/api/v3/asset_platforms`, {
    headers: {
      [`x-cg-${coingeckoTier}-api-key`]: coingeckoApiKey!,
    },
  })

  return (await response.json()) as {
    id: string
    chain_identifier: string | number | null
    name: string
    shortname: string
    native_coin_id: string
  }[]
})

export const coingeckoListAtom = atom(async () => {
  const response = await fetch(`${coingeckoApiUrl}/api/v3/coins/list?include_platform=true`, {
    headers: {
      [`x-cg-${coingeckoTier}-api-key`]: coingeckoApiKey!,
    },
  })

  return (await response.json()) as { id: string; platforms: Record<string, string> }[]
})

export const coingeckoCategoriesAtom = atom(async () => {
  const response = await fetch(`${coingeckoApiUrl}/api/v3/coins/categories`, {
    headers: {
      [`x-cg-${coingeckoTier}-api-key`]: coingeckoApiKey!,
    },
  })

  return await response.json()
})

export const coingeckoCoinsByCategoryAtom = atomFamily((category: string) =>
  atom(async () => {
    const apiUrl = import.meta.env.VITE_COIN_GECKO_API
    const apiKey = import.meta.env.VITE_COIN_GECKO_API_KEY
    const tier = import.meta.env.VITE_COIN_GECKO_API_TIER
    const response = await fetch(
      `${apiUrl}/api/v3/coins/markets?vs_currency=usd&category=${category}&include_platform=true`,
      {
        headers: {
          [`x-cg-${tier}-api-key`]: apiKey!,
        },
      }
    )

    return await response.json()
  })
)

export const uniswapSafeTokensList = atom(async () => {
  const response = await fetch('https://tokens.uniswap.org/')
  return (await response.json()).tokens as { chainId: number; address: string }[]
})

export const uniswapExtendedTokensList = atom(async () => {
  const response = await fetch('https://extendedtokens.uniswap.org/')
  return (await response.json()).tokens as { chainId: number; address: string }[]
})

export const safeTokensListAtom = atom(async get => {
  const uniswapSafeTokens = await get(uniswapSafeTokensList)
  const uniswapExtendedTokens = await get(uniswapExtendedTokensList)
  return [...uniswapSafeTokens, ...uniswapExtendedTokens]
})

const coingeckoCoinByAddressAtom = atomFamily((addressPlatform: string) =>
  atom(async () => {
    const [address, platform] = addressPlatform.split(':')
    if (!address || !platform) return null
    const response = await fetch(`${coingeckoApiUrl}/api/v3/coins/${platform}/contract/${address}`, {
      headers: {
        [`x-cg-${coingeckoTier}-api-key`]: coingeckoApiKey!,
      },
    })

    return (await response.json()) as {
      image?: {
        large: string
        small: string
        thumb: string
      }
    }
  })
)

export const swapFromSearchAtom = atom<string>('')
export const swapToSearchAtom = atom<string>('')

const erc20Atom = atomFamily((addressChainId: string) =>
  atom(async (get): Promise<SwappableAssetWithDecimals | null> => {
    const [address, chainIdString] = addressChainId.split(':')
    if (!address || !chainIdString) return null
    const chainId = +chainIdString
    const isValidAddress = isAddress(address)
    if (!isValidAddress || isNaN(chainId)) return null

    const chain: ViemChain | undefined = Object.values(allEvmChains).find(c => c?.id === chainId)
    if (!chain) return null
    const platforms = await get(coingeckoAssetPlatformsAtom)
    const platform = platforms.find(p => p.chain_identifier === chainId)
    if (!platform) return null

    const client = createPublicClient({ transport: http(), chain })

    const [symbolData, decimalsData, namedata] = await client.multicall({
      contracts: [
        {
          abi: erc20Abi,
          address,
          functionName: 'symbol',
        },
        {
          abi: erc20Abi,
          address,
          functionName: 'decimals',
        },
        {
          abi: erc20Abi,
          address,
          functionName: 'name',
        },
      ],
    })

    const symbol = symbolData.status === 'success' ? symbolData.result : null
    const decimals = decimalsData.status === 'success' ? decimalsData.result : null
    const name = namedata.status === 'success' ? namedata.result : null
    if (!symbol || !decimals || !name) return null

    const coingeckoData = await get(coingeckoCoinByAddressAtom(`${address}:${platform.id}`))
    const id = evmErc20TokenId(address, chainIdString)

    return {
      id,
      chainId,
      context: {
        lifi: {
          address,
          chainId,
          decimals,
          name,
          symbol,
          priceUSD: '0.00',
        } as sdk.Token,
      },
      decimals,
      name,
      symbol,
      networkType: 'evm',
      contractAddress: address,
      image: coingeckoData?.image?.small,
    }
  })
)

const filterAndSortTokens = async (
  get: Getter,
  tokens: SwappableAssetWithDecimals[],
  search: string
): Promise<SwappableAssetWithDecimals[]> => {
  if (search.trim().length > 0) {
    const isSearchingAddress = isAddress(search)
    const searchLoweredCase = search.toLowerCase()
    const knownFilteredTokens = tokens.filter(
      t =>
        t.symbol.toLowerCase().startsWith(searchLoweredCase) ||
        t.name.toLowerCase().startsWith(searchLoweredCase) ||
        (isSearchingAddress && t.contractAddress?.startsWith(searchLoweredCase))
    )

    if (isSearchingAddress && knownFilteredTokens.length === 0) {
      // find token details from on chain
      const allOnChainTokens = await Promise.all(
        [
          allEvmChains['mainnet'],
          allEvmChains['arbitrum'],
          allEvmChains['base'],
          allEvmChains['bsc'],
          allEvmChains['polygon'],
          allEvmChains['optimism'],
          allEvmChains['blast'],
          allEvmChains['zkSync'],
        ]
          .flatMap(chain => (chain ? chain : []))
          .map(chain => get(erc20Atom(`${search}:${chain.id}`)))
      )
      return allOnChainTokens.filter(t => t !== null)
    }
    const safeTokens = await get(safeTokensListAtom)
    return knownFilteredTokens.sort((a, b) => {
      // prioritize native tokens
      if (a.id.includes('native') && !b.id.includes('native')) return -1
      if (b.id.includes('native') && !a.id.includes('native')) return 1

      // prioritize tokens in safe tokens list
      const aSafe = safeTokens.some(t => t.address.toLowerCase() === a.contractAddress?.toLowerCase())
      const bSafe = safeTokens.some(t => t.address.toLowerCase() === b.contractAddress?.toLowerCase())
      if (aSafe && !bSafe) return -1
      if (bSafe && !aSafe) return 1

      // prioritize tokens with exact symbol match
      const aSymbol = a.symbol.toLowerCase()
      const bSymbol = b.symbol.toLowerCase()
      if (aSymbol === searchLoweredCase && bSymbol !== searchLoweredCase) return -1
      if (bSymbol === searchLoweredCase && aSymbol !== searchLoweredCase) return 1
      // if both are same symbol and both match search, sort by chain id
      if (aSymbol === searchLoweredCase && bSymbol === searchLoweredCase) return +a.chainId - +b.chainId

      // then prioritize tokens with exact start of symbol match
      if (aSymbol.startsWith(searchLoweredCase) && !bSymbol.startsWith(searchLoweredCase)) return -1
      if (bSymbol.startsWith(searchLoweredCase) && !aSymbol.startsWith(searchLoweredCase)) return 1
      // if both have matching start, sort by chain id
      if (aSymbol.startsWith(searchLoweredCase) && bSymbol.startsWith(searchLoweredCase)) return +a.chainId - +b.chainId

      return a.symbol.localeCompare(b.symbol)
    })
  }
  const tab = get(tokenTabAtom)
  const filter = tokenTabs.find(t => t.value === tab)?.filter
  const sort = tokenTabs.find(t => t.value === tab)?.sort
  const coingeckoCategoryId = tokenTabs.find(t => t.value === tab && t.coingecko)?.value
  if (filter) tokens = tokens.filter(filter)
  if (sort) tokens = tokens.sort(sort)
  if (coingeckoCategoryId) tokens = await getCoingeckoCategoryTokens(get, coingeckoCategoryId, tokens)

  return tokens
}

/**
 * Unify all tokens we support for swapping on the UI
 * Note that this list is just to get the tokens we display initially on the UI
 * Users should later be able to paste any arbitrary address to swap any token
 * This will happen when we support other protocols like uniswap, sushiswap, etc
 *  */
export const fromAssetsAtom = atom(async get => {
  const allTokensSelector = swapModules.map(module => module.fromAssetsSelector)
  const tokensByChains = await getTokensByChainId(get, allTokensSelector)
  const search = get(swapFromSearchAtom)

  const tokens = Object.values(tokensByChains)
    .map(tokens =>
      Object.values(tokens).sort((a, b) => a.symbol.replaceAll('$', '').localeCompare(b.symbol.replaceAll('$', '')))
    )
    .flat()

  const filteredTokens = await filterAndSortTokens(get, tokens, search)
  // from assets should not include btc
  return filteredTokens.filter(t => t.networkType !== 'btc')
})

export const toAssetsAtom = atom(async get => {
  const fromAsset = get(fromAssetAtom)
  const search = get(swapToSearchAtom)

  // only select from the protocols that fromAsset support
  const allTokensSelector = swapModules
    .filter(m => (fromAsset ? fromAsset.context[m.protocol] : true))
    .map(module => module.toAssetsSelector)

  const tokensByChains = await getTokensByChainId(get, allTokensSelector)
  const tokens = Object.values(tokensByChains)
    .map(tokens =>
      Object.values(tokens).sort((a, b) => a.symbol.replaceAll('$', '').localeCompare(b.symbol.replaceAll('$', '')))
    )
    .flat()

  return await filterAndSortTokens(get, tokens, search)
})

export const swapQuotesAtom = loadable(
  atom(async (get): Promise<Loadable<Promise<BaseQuote | null>>[] | null> => {
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const allQuoters = swapModules
      .filter(m =>
        fromAsset && toAsset
          ? // if both assets are evm, we automatically attempt to get quote from lifi
            fromAsset.networkType === 'evm' && toAsset.networkType === 'evm' && m.protocol === 'lifi'
            ? true
            : toAsset.context[m.protocol] && fromAsset.context[m.protocol]
          : true
      )
      .map(module => module.quote)
    const fromAmount = get(fromAmountAtom)
    const substrateApiGetter = get(substrateApiGetterAtom)

    // force refresh
    get(swapQuoteRefresherAtom)

    // nothing to quote
    if (!fromAsset || !toAsset || !fromAmount.planck || !substrateApiGetter) return null

    const allQuotes = allQuoters
      .map(get)
      .map(q => (q.state === 'hasData' ? (Array.isArray(q.data) ? q.data.flat() : q) : q))
      .flat()

    // map each, if loaded, return only if output > 0
    return allQuotes.filter(q => {
      if (q.state !== 'hasData') return true
      if (!q.data || Array.isArray(q.data)) return false
      return q.data.outputAmountBN > 0n
    }) as Loadable<Promise<BaseQuote | null>>[] | null
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
      if (q.state !== 'hasData') return { quote: q, fees: 0 }
      const fees = q.data?.fees
        .reduce((acc, fee) => {
          const rate = tokenRates[fee.tokenId]?.usd?.price ?? 0
          return acc.plus(fee.amount.times(rate))
        }, BigNumber(0))
        ?.toNumber()
      return {
        quote: q,
        fees,
      }
    })
    .sort((a, b) => {
      // all loading quotes should be at the end
      if (a.quote.state !== 'hasData' || !a.quote.data) return 1
      if (b.quote.state !== 'hasData' || !b.quote.data) return -1
      switch (sort) {
        case 'bestRate':
          return +(b.quote.data.outputAmountBN - a.quote.data.outputAmountBN).toString()
        case 'fastest':
          return a.quote.data.timeInSec - b.quote.data.timeInSec
        case 'cheapest':
          return (a.fees ?? 0) - (b.fees ?? 0)
        case 'decentalised':
          return b.quote.data.decentralisationScore - a.quote.data.decentralisationScore
        default:
          return 0
      }
    })
})

export const selectedQuoteAtom = atom(async get => {
  const quotes = await get(sortedQuotesAtom)
  const selectedProtocol = get(selectedProtocolAtom)
  const subProtocol = get(selectedSubProtocolAtom)
  if (!quotes) return null
  const quote =
    quotes.find(
      q =>
        q.quote.state === 'hasData' &&
        q.quote.data &&
        q.quote.data.protocol === selectedProtocol &&
        (q.quote.data.subProtocol ? q.quote.data.subProtocol === subProtocol : true)
    ) ?? quotes[0]
  if (!quote) return null
  return quote
})

const approvalCounterAtom = atom(0)
export const approvalAtom = atom(async get => {
  const protocol = get(selectedProtocolAtom)
  const quotes = await get(sortedQuotesAtom)

  const defaultQuote = quotes?.[0]
  const selectedProtocol =
    protocol ?? (defaultQuote?.quote.state === 'hasData' ? defaultQuote.quote.data?.protocol : null)
  const module = swapModules.find(module => module.protocol === selectedProtocol)

  if (!module?.approvalAtom || !selectedProtocol) return null

  const approval = get(module.approvalAtom)
  if (!approval) return null

  const chain = Object.values(allEvmChains).find(c => c?.id === approval.chainId)
  // chain unsupported
  if (!chain) return null

  // trigger approval check when updated
  get(approvalCounterAtom)

  const client = createPublicClient({ transport: http(), chain })
  const allowance = await client.readContract({
    abi: erc20Abi,
    address: approval.tokenAddress as `0x${string}`,
    functionName: 'allowance',
    args: [approval.fromAddress as `0x${string}`, approval.contractAddress as `0x${string}`],
  })

  if (allowance >= approval.amount) return null
  return { ...approval, chain }
})

export const toAmountAtom = atom(async get => {
  const quote = await get(selectedQuoteAtom)
  if (!quote) return null

  const toAsset = get(toAssetAtom)
  if (!quote || quote.quote.state !== 'hasData' || quote.quote.data?.outputAmountBN === undefined || !toAsset)
    return null
  return Decimal.fromPlanck(quote.quote.data.outputAmountBN, toAsset.decimals, { currency: toAsset.symbol })
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const setFromAmount = useSetAtom(fromAmountAtom)

  const [fromAsset, setFromAsset] = useAtom(fromAssetAtom)
  const [toAsset, setToAsset] = useAtom(toAssetAtom)

  const toAmount = useAtomValue(loadable(toAmountAtom))

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

  const setToAddress = useSetToAddress()

  // pick first account from wallet if no account is set
  useEffect(() => {
    if (!fromEvmAccount && ethAccounts.length > 0) {
      const newFromAddress = (ethAccounts[0]?.address as `0x${string}` | null) ?? null
      setFromEvmAddress(newFromAddress)
      setToAddress({ fromAddress: newFromAddress })
    }
    if (!fromSubstrateAccount && substrateAccounts.length > 0) {
      const newFromAddress = substrateAccounts[0]?.address ?? null
      setFromSubstrateAddress(newFromAddress)
      setToAddress({ fromAddress: newFromAddress })
    }
  }, [
    ethAccounts,
    fromEvmAccount,
    fromSubstrateAccount,
    setFromEvmAddress,
    setFromSubstrateAddress,
    setToAddress,
    substrateAccounts,
  ])

  return { ethAccounts, substrateAccounts, fromEvmAccount, fromSubstrateAccount, fromEvmAddress, fromSubstrateAddress }
}

export const useSetToAddress = () => {
  const _fromAddress = useAtomValue(fromAddressAtom)
  const _toAsset = useAtomValue(toAssetAtom)

  const [toEvmAddress, setToEvmAddress] = useAtom(toEvmAddressAtom)
  const [toSubstrateAddress, setToSubstrateAddress] = useAtom(toSubstrateAddressAtom)
  const [toBtcAddress, setToBtcAddress] = useAtom(toBtcAddressAtom)

  const chains = useChains()
  const networks = useEvmNetworks()

  const setToAddress = useCallback(
    (
      /**
       * Use overrides when calling `setToAddress` at the same time as `setFromAddress` or `setToAsset`.
       * This will set toAddress based on the values being set, rather than the last values from `fromAddressAtom`/`toAssetAtom`.
       */
      overrides: { fromAddress?: string | null; toAsset?: SwappableAssetWithDecimals | null } = {}
    ) => {
      const fromAddress = overrides.fromAddress ?? _fromAddress
      const toAsset = overrides.toAsset ?? _toAsset
      const toNetwork = toAsset?.chainId ? chains[toAsset.chainId] ?? networks[toAsset.chainId] ?? null : null

      // when fromAddress, fromAsset or toAsset changes, set toAddress to either fromAddress or null, depending on whether it's compatible with the new toAsset
      switch (toAsset?.networkType) {
        case 'evm': {
          // toAddress is already evm, don't change anything
          if (toEvmAddress && isEthereumAddress(toEvmAddress)) return

          // fromAddress isn't evm, set toAddress to null
          if (!fromAddress || !isEthereumAddress(fromAddress))
            return setToEvmAddress(null), setToSubstrateAddress(null), setToBtcAddress(null)

          // fromAddress is evm, set toAddress to fromAddress
          return (
            setToEvmAddress(fromAddress as `0x${string}` | null), setToSubstrateAddress(null), setToBtcAddress(null)
          )
        }
        case 'substrate': {
          const networkAccountType = toNetwork && 'account' in toNetwork ? toNetwork.account : null
          const isCompatibleWithNetwork = (address: string) =>
            isEthereumAddress(address) ? networkAccountType === 'secp256k1' : networkAccountType !== 'secp256k1'

          // toAddress is already substrate, don't change anything (if it's still compatible with this network)
          if (toSubstrateAddress && (!toNetwork || isCompatibleWithNetwork(toSubstrateAddress))) return

          // fromAddress isn't substrate, set toAddress to null
          if (!fromAddress || !isCompatibleWithNetwork(fromAddress))
            return setToEvmAddress(null), setToSubstrateAddress(null), setToBtcAddress(null)

          // fromAddress is substrate, set toAddress to fromAddress
          return setToEvmAddress(null), setToSubstrateAddress(fromAddress), setToBtcAddress(null)
        }
        case 'btc': {
          // toAddress is already btc, don't change anything
          if (toBtcAddress) return

          // fromAddress is never btc, always set toAddress to null
          return setToEvmAddress(null), setToSubstrateAddress(null), setToBtcAddress(null)
        }
        case undefined: {
          return
        }
        default: {
          console.error(`networkType ${toAsset?.networkType} not handled in updateSelectedAccountsOnAssetChange`)
          return setToEvmAddress(null), setToSubstrateAddress(null), setToBtcAddress(null)
        }
      }
    },
    [
      _fromAddress,
      _toAsset,
      chains,
      networks,
      setToBtcAddress,
      setToEvmAddress,
      setToSubstrateAddress,
      toBtcAddress,
      toEvmAddress,
      toSubstrateAddress,
    ]
  )

  return setToAddress
}

export const categoriesAtom = atom(async () => {
  const api = import.meta.env.VITE_COIN_GECKO_API
  const apiKey = import.meta.env.VITE_COIN_GECKO_API_KEY

  const response = await fetch(`${api}/api/v3//coins/markets?vs_currency=usd&category=wallets`, {
    headers: {
      'x-cg-pro-api-key': apiKey!,
    },
  })

  return await response.json()
})

export const useSwapErc20Approval = () => {
  const approval = useAtomValue(loadable(approvalAtom))
  const { data: walletClient } = useWalletClient()
  const [approving, setApproving] = useState(false)
  const setApprovalCounter = useSetAtom(approvalCounterAtom)

  const approvalData = useMemo(() => {
    if (approval.state !== 'hasData' || !approval.data) return null
    return approval.data
  }, [approval])

  const approve = useCallback(async () => {
    if (!walletClient) {
      toast.error('Wallet not connected')
      return
    }
    if (!approvalData) {
      toast.error('Approval not ready yet')
      return
    }

    // start approve spending flow
    setApproving(true)
    try {
      await walletClient.switchChain(approvalData.chain)
      const approveTxHash = await walletClient.writeContract({
        abi: erc20Abi,
        functionName: 'approve',
        address: approvalData.tokenAddress as `0x${string}`,
        args: [approvalData.contractAddress as `0x${string}`, approvalData.amount],
        chain: approvalData.chain,
      })

      // wait for approval tx to be included
      const client = createPublicClient({ transport: http(), chain: approvalData.chain })
      const approved = await client.waitForTransactionReceipt({ hash: approveTxHash })

      if (approved.status === 'success') setApprovalCounter(c => c + 1)
      if (approved.status === 'reverted') throw new Error('Approval reverted')
    } catch (e) {
      console.error(e)
      toast.error('Failed to approve token.')
    } finally {
      setApproving(false)
    }
  }, [approvalData, setApprovalCounter, walletClient])

  return { data: approvalData, approve, approving, loading: approval.state === 'loading' }
}
