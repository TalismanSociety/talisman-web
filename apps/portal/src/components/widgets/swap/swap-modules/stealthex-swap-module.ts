import type { Chain as ViemChain } from 'viem/chains'
import { QuoteResponseV2 } from '@chainflip/sdk/swap'
import { chainsAtom, tokensByIdAtom } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { atom, ExtractAtomValue, Getter, Setter } from 'jotai'
import { atomFamily, loadable } from 'jotai/utils'
import createClient from 'openapi-fetch'
import { createPublicClient, encodeFunctionData, erc20Abi, fallback, http, isAddress } from 'viem'
import {
  arbitrum,
  arbitrumNova,
  base,
  bsc,
  mainnet,
  manta,
  moonbeam,
  opBNB,
  optimism,
  polygon,
  theta,
  zksync,
} from 'viem/chains'

import { substrateApiGetterAtom } from '@/domains/common/recoils/api'
import { Decimal } from '@/util/Decimal'

import type {
  paths as StealthexApi,
  SchemaCurrency as StealthexCurrency,
  SchemaExchange as StealthexExchange,
} from './stealthex.api.d.ts'
import { knownEvmNetworksAtom } from '../helpers'
import stealthexLogo from '../side-panel/details/logos/stealthex-logo.svg'
import { vanaMainnet } from '../vana'
import {
  BaseQuote,
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  GetEstimateGasTxFunction,
  getTokenIdForSwappableAsset,
  QuoteFee,
  QuoteFunction,
  saveAddressForQuest,
  substrateAssetsSwapTransfer,
  substrateNativeSwapTransfer,
  SupportedSwapProtocol,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
  validateAddress,
} from './common.swap-module'

const apiUrl = import.meta.env.VITE_STEALTHEX_API || 'https://stealthex.talisman.xyz'
const PROTOCOL: SupportedSwapProtocol = 'stealthex' as const
const PROTOCOL_NAME = 'StealthEX'
const DECENTRALISATION_SCORE = 1.5
type FeeProps = { fromAsset: SwappableAssetBaseType; toAsset: SwappableAssetBaseType }
const getTalismanTotalFee = ({ fromAsset, toAsset }: FeeProps) => {
  const isSubToOrFromEvm =
    (fromAsset.networkType === 'substrate' && toAsset.networkType === 'evm') ||
    (fromAsset.networkType === 'evm' && toAsset.networkType === 'substrate')

  const isSubToOrFromSub =
    (fromAsset.networkType === 'substrate' && toAsset.networkType === 'substrate') ||
    (fromAsset.networkType === 'substrate' && toAsset.networkType === 'substrate')

  const isEvmToOrFromEvm =
    (fromAsset.networkType === 'evm' && toAsset.networkType === 'evm') ||
    (fromAsset.networkType === 'evm' && toAsset.networkType === 'evm')

  const isToOrFromBtc = fromAsset.networkType === 'btc' || toAsset.networkType === 'btc'

  if (isSubToOrFromEvm) return 0.015 // 1.5% total fee for sub<>evm
  if (isSubToOrFromSub) return 0.005 // 0.5% total fee for sub<>sub
  if (isEvmToOrFromEvm) return 0.002 // 0.2% total fee for evm<>evm (NOTE: will actually be 0.4%, as that is the minimum we can set via stealthex for now)
  if (isToOrFromBtc) return 0.015 // 1.5% total fee for any<>btc
  return 0.01 // 1.0% total fee by default
}
const BUILT_IN_FEE = 0.004 // StealthEX always includes an affiliate fee of 0.4%
const getAdditionalFee = (feeProps: FeeProps) =>
  Math.max(
    // we want a total fee of x,
    // so get the total talisman fee for this route,
    // then subtract the built-in fee of 0.4%, which is applied to all exchanges made via stealthex
    getTalismanTotalFee(feeProps) - BUILT_IN_FEE,
    // if the talisman total fee is less than the built-in fee, default to an additional_fee of 0.0
    0
  )
// Our UI represents a 1% fee as `0.01`, but the StealthEX api represents a 1% fee as `1.0`.
// 1.0 = 0.01 * 100
const getAdditionalFeePercent = (feeProps: FeeProps) => getAdditionalFee(feeProps) * 100 // to percent

const LOGO = stealthexLogo

type AssetContext = {
  network: string
  symbol: string
}

const supportedEvmChains: Record<string, ViemChain | undefined> = {
  arbitrum,
  arbnova: arbitrumNova,
  base,
  bsc,
  eth: mainnet,
  glmr: moonbeam,
  manta,
  matic: polygon,
  opbnb: opBNB,
  optimism,
  theta,
  zksync,
  vana: vanaMainnet,
}

/**
 * specialAssets list defines a mappings of assets from stealthex to our internal asset representation.
 * Many assets on stealthex are not tradeable in an onchain context because they dont come with contract addresses.
 * To avoid displaying a token which we dont have contract address for (which could result in a bunch of issues like, not being able to display the token balance, not being able to transfer the token for swapping and etc),
 * We support mainly 2 types of assets:
 * - ERC20 tokens: we only support ERC20 tokens from stealthex that comes with contract addresses
 * - Special assets: all substrate and evm native assets from stealthex are whitelisted as special assets
 */
const specialAssets: Record<string, Omit<SwappableAssetBaseType, 'context'>> = {
  'mainnet::dot': {
    id: 'polkadot-substrate-native',
    name: 'Polkadot',
    symbol: 'DOT',
    chainId: 'polkadot',
    networkType: 'substrate',
  },
  'polkadot::ksm': {
    id: 'kusama-substrate-native',
    name: 'Kusama',
    symbol: 'KSM',
    chainId: 'kusama',
    networkType: 'substrate',
  },
  'polkadot::usdt': {
    id: 'polkadot-asset-hub-substrate-assets-1984-usdt',
    name: 'USDT (Polkadot)',
    chainId: 'polkadot-asset-hub',
    symbol: 'USDT',
    networkType: 'substrate',
    assetHubAssetId: '1984',
  },
  'polkadot::usdc': {
    id: 'polkadot-asset-hub-substrate-assets-1337-usdc',
    name: 'USDC (Polkadot)',
    chainId: 'polkadot-asset-hub',
    symbol: 'USDC',
    networkType: 'substrate',
    assetHubAssetId: '1337',
  },
  'mainnet::eth': {
    id: '1-evm-native',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'arbitrum::eth': {
    id: '42161-evm-native',
    name: 'Ethereum',
    chainId: 42161,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'arbnova::eth': {
    id: '42170-evm-native',
    name: 'Ethereum',
    chainId: 42170,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'base::eth': {
    id: '8453-evm-native',
    name: 'Ethereum',
    chainId: 8453,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'bsc::eth': {
    id: '56-evm-native',
    name: 'Ethereum',
    chainId: 56,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'optimism::eth': {
    id: '10-evm-native',
    name: 'Ethereum',
    chainId: 10,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'mainnet::vana': {
    id: '1480-evm-native',
    name: 'Vana',
    chainId: 1480,
    symbol: 'VANA',
    networkType: 'evm',
  },
  'manta::eth': {
    id: '169-evm-native',
    name: 'Ethereum (Manta Pacific)',
    chainId: 169,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'zksync::eth': {
    id: '324-evm-native',
    name: 'Ethereum',
    chainId: 324,
    symbol: 'ETH',
    networkType: 'evm',
  },
  'mainnet::tao': {
    id: 'bittensor-substrate-native',
    name: 'Bittensor',
    chainId: 'bittensor',
    symbol: 'TAO',
    networkType: 'substrate',
  },
  'mainnet::btc': {
    id: 'btc-native',
    name: 'Bitcoin',
    chainId: 'bitcoin',
    symbol: 'BTC',
    networkType: 'btc',
  },
  'mainnet::astr': {
    id: 'astar-substrate-native',
    name: 'Astar',
    symbol: 'ASTR',
    chainId: 'astar',
    networkType: 'substrate',
  },
  'mainnet::azero': {
    id: 'aleph-zero-substrate-native',
    name: 'Aleph Zero',
    symbol: 'AZERO',
    chainId: 'aleph-zero',
    networkType: 'substrate',
  },
  'mainnet::aca': {
    id: 'acala-substrate-native',
    name: 'ACALA',
    symbol: 'ACA',
    chainId: 'acala',
    networkType: 'substrate',
  },
}

const api = createClient<StealthexApi>({ baseUrl: apiUrl })
const stealthexSdk = {
  getAllCurrencies: async ({ withAvailableRoutes = false }: { withAvailableRoutes?: boolean } = {}): Promise<
    StealthexCurrency[]
  > => {
    const allCurrencies: StealthexCurrency[] = []
    const fetchCurrenciesPage = async (limit: number, offset: number) => {
      try {
        const { data: currencies } = await api.GET('/v4/currencies', {
          params: { query: { limit, offset, include_available_routes: `${withAvailableRoutes}` } },
        })
        if (!Array.isArray(currencies)) return []
        return currencies
      } catch {
        return []
      }
    }

    // NOTE: To reduce latency, pre-fetch the first 8 pages, then continue fetching pages until the response is empty
    let offset = 0
    const limit = 250
    // pre-fetch
    const currencies = await Promise.all([
      fetchCurrenciesPage(limit, offset),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
      fetchCurrenciesPage(limit, (offset += limit)),
    ])
    allCurrencies.push(...currencies.flat())
    // continue fetching
    for (;;) {
      const currencies = await fetchCurrenciesPage(limit, (offset += limit))
      allCurrencies.push(...currencies)
      if (currencies.length !== 250) break
    }

    return allCurrencies
  },
  getPairs: async ({
    symbol,
    network,
  }: {
    symbol: string
    network: string
  }): Promise<StealthexCurrency['available_routes']> => {
    const { data: currency, error } = await api.GET('/v4/currencies/{symbol}/{network}', {
      params: { path: { symbol, network }, query: { include_available_routes: 'true' } },
    })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return currency?.available_routes
  },
  getRange: async ({
    route,
    estimation,
    rate,
    additional_fee_percent,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
    additional_fee_percent?: number
  }): Promise<{ min: BigNumber }> => {
    // default values
    estimation ||= 'direct'
    rate ||= 'floating'

    const params = {
      route,
      estimation,
      rate,
      additional_fee_percent,
    }
    if (params.additional_fee_percent === undefined) delete params.additional_fee_percent
    if (params.additional_fee_percent === 0.0) delete params.additional_fee_percent

    const { data: range, error } = await api.POST('/v4/rates/range', { body: params })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return { min: BigNumber(range?.min_amount ?? 0) }
  },
  getEstimate: async ({
    route,
    amount,
    estimation,
    rate,
    additional_fee_percent,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    amount: number
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
    additional_fee_percent?: number
  }): Promise<number> => {
    // default values
    estimation ||= 'direct'
    rate ||= 'floating'

    const params = {
      route,
      amount,
      estimation,
      rate,
      additional_fee_percent,
    }
    if (params.additional_fee_percent === undefined) delete params.additional_fee_percent
    if (params.additional_fee_percent === 0.0) delete params.additional_fee_percent

    const { data: estimate, error } = await api.POST('/v4/rates/estimated-amount', { body: params })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return estimate?.estimated_amount
  },
  createExchange: async ({
    route,
    amount,
    estimation,
    rate,
    address,
    extra_id,
    refund_address,
    refund_extra_id,
    additional_fee_percent,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    amount: number
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
    address: string
    extra_id?: string
    refund_address?: string
    refund_extra_id?: string
    additional_fee_percent?: number
  }): Promise<StealthexExchange> => {
    // default values
    estimation ||= 'direct'
    rate ||= 'floating'

    const params = {
      route,
      amount,
      estimation,
      rate,
      address,
      extra_id,
      refund_address,
      refund_extra_id,
      additional_fee_percent,
    }
    if (extra_id === undefined) delete params.extra_id
    if (refund_address === undefined) delete params.refund_address
    if (refund_extra_id === undefined) delete params.refund_extra_id
    if (params.additional_fee_percent === undefined) delete params.additional_fee_percent
    if (params.additional_fee_percent === 0.0) delete params.additional_fee_percent

    const { data: exchange, error } = await api.POST('/v4/exchanges', { body: params })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return exchange
  },
  getExchange: async (id: string): Promise<StealthexExchange> => {
    const { data: exchange, error } = await api.GET('/v4/exchanges/{id}', { params: { path: { id } } })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return exchange
  },
}

export const allPairsCsvAtom = atom(async get => {
  const currencies = await stealthexSdk.getAllCurrencies({ withAvailableRoutes: true })

  const assets = await get(assetsAtom)
  const assetsById = new Map(assets.map(asset => [asset.id, asset]))

  const currenciesMapKey = (currency: Pick<(typeof currencies)[number], 'network' | 'symbol'>) =>
    `${currency.network}::${currency.symbol}`
  const currenciesMap = new Map(currencies.map(currency => [currenciesMapKey(currency), currency]))

  const assetId = (currency: Pick<(typeof currencies)[number], 'network' | 'symbol'>) => {
    const evmChain = supportedEvmChains[currency.network]
    if (evmChain) {
      const contractAddress = currenciesMap.get(currenciesMapKey(currency))?.contract_address
      return getTokenIdForSwappableAsset('evm', evmChain.id, contractAddress ?? undefined)
    }
    return specialAssets[`${currency.network}::${currency.symbol}`]?.id
  }

  const routes = currencies
    // remove currencies with no available routes
    .filter(currency => currency.available_routes?.length)
    // map to asset ids
    .map(currency => ({
      assetId: assetId(currency),
      currencyId: currenciesMapKey(currency),
      routes: (currency.available_routes ?? [])
        // map routes to asset ids
        .map(route => ({
          assetId: assetId(route),
          currencyId: currenciesMapKey(route),
          hasCurrency: !!currenciesMap.get(currenciesMapKey(route)),
        }))
        // filter out routes with no asset id / currency
        .flatMap(({ hasCurrency, ...route }) => (route.assetId && hasCurrency ? route : [])),
    }))
    // filter out currencies with no asset id
    .flatMap(route => (route.assetId ? route : []))

  const assetRoutes = routes.flatMap(route => ({
    asset: assetsById.get(route.assetId ?? ''),
    routes: route.routes.map(route => ({ asset: assetsById.get(route.assetId ?? '') })),
  }))

  const rows = assetRoutes.flatMap(from => from.routes.map(to => ({ from: from.asset, to: to.asset })))

  return [['fromsymbol', 'fromchain', 'tosymbol', 'tochain'].join(',')]
    .concat(
      rows
        .filter(({ from, to }) => from?.symbol && from?.chainId && to?.symbol && to?.chainId)
        .map(({ from, to }) => [from?.symbol, from?.chainId, to?.symbol, to?.chainId].join(','))
    )
    .join('\n')
})

const assetsAtom = atom(async get => {
  const allCurrencies = await stealthexSdk.getAllCurrencies()

  const supportedTokens = allCurrencies.filter(currency => {
    const isEvmNetwork = !!supportedEvmChains[currency.network]
    const isSpecialAsset = !!specialAssets[`${currency.network}::${currency.symbol}`]

    // evm assets must be whitelisted as a special asset or have a contract address
    if (isEvmNetwork) return isSpecialAsset || !!currency.contract_address

    // substrate assets must be whitelisted as a special asset
    return isSpecialAsset
  })
  const tokensById = await get(tokensByIdAtom)

  return Object.values(
    supportedTokens.reduce((acc, currency) => {
      const evmChain = supportedEvmChains[currency.network]
      const specialAsset = specialAssets[`${currency.network}::${currency.symbol}`]

      const id = evmChain
        ? getTokenIdForSwappableAsset(
            'evm',
            evmChain.id,
            currency.contract_address ? currency.contract_address : undefined
          )
        : specialAsset?.id
      const chainId = evmChain ? evmChain.id : specialAsset?.chainId
      if (!id || !chainId) return acc

      const image =
        (tokensById[id]?.logo !== githubUnknownTokenLogoUrl ? tokensById[id]?.logo : undefined) ?? currency.icon_url
      const asset: SwappableAssetBaseType<{ stealthex: AssetContext }> = {
        id,
        name: specialAsset?.name ?? currency.name,
        symbol: specialAsset?.symbol ?? currency.symbol,
        chainId,
        contractAddress: currency.contract_address ? currency.contract_address : undefined,
        image,
        networkType: evmChain ? 'evm' : specialAsset?.networkType ?? 'substrate',
        assetHubAssetId: specialAsset?.assetHubAssetId,
        context: {
          stealthex: {
            network: currency.network,
            symbol: currency.symbol,
          },
        },
      }
      return { ...acc, [id]: asset }
    }, {} as Record<string, SwappableAssetBaseType<{ stealthex: AssetContext }>>)
  )
})

const pairKeyFromPair = (pair: Awaited<ExtractAtomValue<typeof pairsAtom>>[number]) => `${pair.network}::${pair.symbol}`
const pairKeyFromAsset = (asset: SwappableAssetBaseType) =>
  asset && `${asset.context?.stealthex?.network}::${asset.context?.stealthex?.symbol}`

const pairsAtom = atom(async get => {
  const fromAsset = get(fromAssetAtom)
  const { symbol, network } = fromAsset?.context?.stealthex ?? {}
  if (!symbol || !network) return [] // not supported

  const pairs = await stealthexSdk.getPairs({ symbol, network })
  if (!pairs || !Array.isArray(pairs)) return []

  return pairs
})

const routeHasCustomFeeAtom = atom(async get => {
  const pairs = await get(pairsAtom)
  if (!pairs || !Array.isArray(pairs)) return false

  const toAsset = get(toAssetAtom)
  if (!toAsset || !toAsset.context.stealthex) return false
  if (!('stealthex' in toAsset.context)) return false

  const toAssetKey = pairKeyFromAsset(toAsset)
  const pair = pairs.find(pair => pairKeyFromPair(pair) === toAssetKey)
  if (!pair) return false

  return pair.features.includes('custom_fee')
})

export const fromAssetsSelector = atom(async get => await get(assetsAtom))
export const toAssetsSelector = atom(async get => {
  const allAssets = await get(assetsAtom)
  const fromAsset = get(fromAssetAtom)
  if (!fromAsset) return allAssets

  const pairs = await get(pairsAtom)
  if (!pairs || !Array.isArray(pairs)) return []

  const validDestinations = new Set(pairs.map(pairKeyFromPair))
  const validDestAssets = allAssets.filter(asset => validDestinations.has(pairKeyFromAsset(asset)))

  return [fromAsset, ...validDestAssets]
})

const quote: QuoteFunction = loadable(
  atom(async (get): Promise<(BaseQuote & { data?: QuoteResponseV2['quotes'][number] }) | null> => {
    const substrateApiGetter = get(substrateApiGetterAtom)
    if (!substrateApiGetter) return null

    const getSubstrateApi = substrateApiGetter.getApi
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)
    const routeHasCustomFee = await get(routeHasCustomFeeAtom)

    if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null
    const from: AssetContext = fromAsset.context.stealthex
    const to: AssetContext = toAsset.context.stealthex
    if (!from || !to) return null

    // force refresh
    get(swapQuoteRefresherAtom)

    const additional_fee_percent = routeHasCustomFee ? getAdditionalFeePercent({ fromAsset, toAsset }) : undefined
    const range = await stealthexSdk.getRange({ route: { from, to }, additional_fee_percent })
    if (range && range.min.isGreaterThan(fromAmount.toString()))
      throw new Error(`StealthEX minimum is ${range.min.toString()} ${fromAsset.symbol}`)

    try {
      // TODO: Return `null` or an error when getRange / getEstimate fails
      // Error format: `return { decentralisationScore: DECENTRALISATION_SCORE, protocol: PROTOCOL, inputAmountBN: fromAmount.planck, outputAmountBN: 0n, error: '<error here>', timeInSec: 5 * 60, fees: [], providerLogo: LOGO, providerName: PROTOCOL_NAME, talismanFee: TALISMAN_TOTAL_FEE, }`
      const estimate = await stealthexSdk.getEstimate({
        route: { from, to },
        amount: fromAmount.toNumber(),
        additional_fee_percent,
      })

      const gasFee = await estimateGas(get, { getSubstrateApi })
      // relative fee, multiply by fromAmount to get planck fee
      const talismanFee = Math.max(getTalismanTotalFee({ fromAsset, toAsset }), BUILT_IN_FEE)
      // add talisman fee
      const fees: QuoteFee[] = (gasFee ? [gasFee] : []).concat({
        amount: BigNumber(fromAmount.planck.toString())
          .times(10 ** -fromAmount.decimals)
          .times(talismanFee),
        name: 'Talisman Fee',
        tokenId: fromAsset.id,
      })

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: Decimal.fromUserInput(String(estimate), toAsset.decimals).planck,
        // simpleswap swaps take about 5mins, assuming here that stealthex takes a similar amount of time
        timeInSec: 5 * 60,
        fees,
        providerLogo: LOGO,
        providerName: PROTOCOL_NAME,
        talismanFee,
      }
    } catch (cause) {
      console.error(`Failed to get StealthEX quote`, cause)
      return null
    }
  })
)

const swap: SwapFunction<{ id: string }> = async (
  get: Getter,
  _: Setter,
  { evmWalletClient, getSubstrateApi, substrateWallet, allowReap }
) => {
  const toAddress = get(toAddressAtom)
  const fromAddress = get(fromAddressAtom)
  const amount = get(fromAmountAtom)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const substrateChains = await get(chainsAtom)

  let addressTo = toAddress
  if (toAsset?.networkType === 'substrate' && addressTo) {
    const substrateChain = substrateChains.find(c => c.id.toString() === toAsset.chainId.toString())
    if (substrateChain) {
      addressTo = encodeAnyAddress(addressTo, substrateChain.prefix ?? 42)
    }
  }
  if (!addressTo) throw new Error('Missing to address')

  let addressFrom = fromAddress
  if (fromAsset?.networkType === 'substrate' && addressFrom) {
    const substrateChain = substrateChains.find(c => c.id.toString() === fromAsset.chainId.toString())
    if (substrateChain) {
      addressFrom = encodeAnyAddress(addressFrom, substrateChain.prefix ?? 42)
    }
  }
  if (!addressFrom) throw new Error('Missing from address')

  if (!fromAsset) throw new Error('Missing from asset')
  if (!toAsset) throw new Error('Missing to asset')

  const from: AssetContext = fromAsset.context.stealthex
  const to: AssetContext = toAsset.context.stealthex
  if (!from) throw new Error('Missing route from')
  if (!to) throw new Error('Missing route to')

  // validate from address for the source chain
  if (!validateAddress(addressFrom, fromAsset.networkType))
    throw new Error(`Cannot swap from ${fromAsset.chainId} chain with address: ${fromAddress}`)

  // validate to address for the target chain
  if (!validateAddress(addressTo, toAsset.networkType))
    throw new Error(`Cannot swap to ${toAsset.chainId} chain with address: ${toAddress}`)

  // cannot swap from BTC
  if (fromAsset.networkType === 'btc') throw new Error('Swapping from BTC is not supported.')

  const routeHasCustomFee = await get(routeHasCustomFeeAtom)

  const additional_fee_percent = routeHasCustomFee ? getAdditionalFeePercent({ fromAsset, toAsset }) : undefined
  const exchange = await stealthexSdk.createExchange({
    route: { from, to },
    amount: amount.toNumber(),
    address: addressTo,
    additional_fee_percent,
  })

  if (!exchange) throw new Error('Error creating exchange')

  // if (exchange.code === 422) {
  //   const min = exchange.description?.match(/min: ([0-9.]+)/i)?.[1]
  //   const max = exchange.description?.match(/max: ([0-9.]+)/i)?.[1]
  //   const message = [
  //     'Amount is out of range',
  //     min && `(min: ${min} ${fromAsset.symbol})`,
  //     max && `(max: ${max} ${fromAsset.symbol})`,
  //   ].join(' ')
  //   throw new Error(message)
  // }
  // verify that the created exchange has the same assets we are trying to swap
  if (
    exchange.deposit.network !== from.network ||
    exchange.deposit.symbol !== from.symbol ||
    exchange.withdrawal.network !== to.network ||
    exchange.withdrawal.symbol !== to.symbol
  )
    throw new Error('Incorrect currencies from provider. Please try again later')
  if (exchange.deposit.amount > amount.toNumber()) throw new Error('Quote changed. Please try again.')
  if (exchange.withdrawal.address !== addressTo)
    throw new Error('Incorrect destination address from provider. Please try again later')

  const depositAmount = Decimal.fromUserInput(String(exchange.deposit.expected_amount), fromAsset.decimals)
  try {
    if (fromAsset.networkType === 'evm') {
      if (!evmWalletClient) throw new Error('Ethereum account not connected')
      const chain = Object.values(supportedEvmChains).find(c => c?.id.toString() === fromAsset.chainId.toString())
      if (!chain) throw new Error('Network not supported')
      await evmWalletClient.switchChain({ id: chain.id })

      if (!chain) throw new Error('Chain not found')
      let hash: string
      if (!fromAsset.contractAddress) {
        hash = await evmWalletClient.sendTransaction({
          chain,
          to: exchange.deposit.address as `0x${string}`,
          value: depositAmount.planck,
          account: fromAddress as `0x${string}`,
        })
      } else {
        hash = await evmWalletClient.writeContract({
          chain,
          abi: erc20Abi,
          address: fromAsset.contractAddress as `0x${string}`,
          functionName: 'transfer',
          account: fromAddress as `0x${string}`,
          args: [exchange.deposit.address as `0x${string}`, depositAmount.planck],
        })
      }

      saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
      return {
        protocol: PROTOCOL,
        depositRes: {
          txHash: hash,
          chainId: chain.id,
        },
        data: { id: exchange.id },
      }
    } else if (fromAsset.networkType === 'substrate') {
      const signer = substrateWallet?.signer
      if (!signer) throw new Error('Substrate wallet not connected.')
      const chains = await get(chainsAtom)
      const substrateChain = chains.find(c => c.id === fromAsset.chainId)
      const rpc = substrateChain?.rpcs?.[0]?.url
      if (!rpc) throw new Error('RPC not found!')
      const polkadotApi = await getSubstrateApi(rpc)

      const transferRes =
        fromAsset.assetHubAssetId !== undefined
          ? await substrateAssetsSwapTransfer(
              polkadotApi,
              allowReap,
              exchange.deposit.address,
              addressFrom,
              fromAsset.assetHubAssetId,
              depositAmount.planck,
              signer
            )
          : await substrateNativeSwapTransfer(
              polkadotApi,
              allowReap,
              exchange.deposit.address,
              addressFrom,
              depositAmount.planck,
              signer
            )

      if (transferRes.ok) saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
      return {
        protocol: PROTOCOL,
        depositRes: {
          extrinsicId: transferRes.id,
          chainId: substrateChain.id,
          error: transferRes.error,
        },
        data: { id: exchange.id },
      }
    }
  } catch (e) {
    console.error(e)
    // TODO: convert to user friendly error messages
    throw e
  }

  throw new Error('Unsupported network')
}

const estimateGas: GetEstimateGasTxFunction = async (get, { getSubstrateApi }) => {
  const fromAsset = get(fromAssetAtom)
  const fromAddress = get(fromAddressAtom)
  if (!fromAsset) return null
  if (!fromAddress) return null

  if (fromAsset.networkType === 'evm') {
    if (!isAddress(fromAddress)) return null // invalid ethereum address
    const knownEvmNetworks = await get(knownEvmNetworksAtom)
    const network = knownEvmNetworks[fromAsset.chainId]
    const evmChain = Object.values(supportedEvmChains).find(c => c?.id.toString() === fromAsset.chainId.toString())

    const data = fromAsset.contractAddress
      ? encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [fromAddress, 0n] })
      : undefined

    if (network && evmChain) {
      const client = createPublicClient({
        transport: fallback(
          network.rpcs.map(rpc => http(rpc, { retryCount: 0 })),
          { retryCount: 0 }
        ),
        chain: evmChain,
      })
      const gasPrice = await client.getGasPrice()
      // the to address and amount dont matter, we just need to place any address here for the estimation
      const gasLimit = await client.estimateGas({
        account: fromAddress as `0x${string}`,
        data,
        to: fromAsset.contractAddress ? (fromAsset.contractAddress as `0x${string}`) : fromAddress,
        value: 0n,
      })
      return {
        name: 'Est. Gas Fees',
        tokenId: network.nativeToken.id,
        amount: BigNumber(gasPrice.toString())
          .times(gasLimit.toString())
          .times(10 ** -network.nativeToken.decimals),
      }
    }

    return null
  }

  // cannot swap from BTC
  const swappingFromBtc = fromAsset.id === 'btc-native'
  if (swappingFromBtc) return null

  // swapping from Polkadot
  const chains = await get(chainsAtom)
  const substrateChain = chains.find(c => c.id === fromAsset.chainId)
  const polkadotApi = await getSubstrateApi(substrateChain?.rpcs?.[0]?.url ?? '')
  const fromAmount = get(fromAmountAtom)
  const transferTx =
    fromAsset.assetHubAssetId !== undefined
      ? (polkadotApi.tx.assets['transferAllowDeath'] ?? polkadotApi.tx.assets['transfer'])(
          fromAsset.assetHubAssetId,
          fromAddress,
          fromAmount.planck
        )
      : (polkadotApi.tx.balances['transferAllowDeath'] ?? polkadotApi.tx.balances['transfer'])(
          fromAddress,
          fromAmount.planck
        )
  const decimals = transferTx.registry.chainDecimals[0] ?? 10 // default to polkadot decimals 10
  const paymentInfo = await transferTx.paymentInfo(fromAddress)
  return {
    name: 'Est. Gas Fees',
    tokenId: substrateChain?.nativeToken?.id ?? 'polkadot-substrate-native',
    amount: BigNumber(paymentInfo.partialFee.toBigInt().toString()).times(10 ** -decimals),
  }
}

export const stealthexSwapModule: SwapModule = {
  protocol: PROTOCOL,
  fromAssetsSelector,
  toAssetsSelector,
  quote,
  swap,
  decentralisationScore: DECENTRALISATION_SCORE,
}

const retryStatus = async (
  get: Getter,
  id: string,
  attempts = 0
): Promise<{ exchange: StealthexExchange; expired?: boolean }> => {
  try {
    const exchange = await stealthexSdk.getExchange(id)
    const expired = false

    if (exchange.status !== 'finished') {
      get(swapQuoteRefresherAtom)
    }

    return { exchange, expired }
  } catch (e) {
    const error = e as Error & { response?: { status: number } }
    // because we're using a broker, the tx isnt always available immediately in their api service
    // so we wait a bit and retry
    if (error.name === 'AxiosError' && error?.response?.status === 404 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      return retryStatus(get, id, attempts + 1)
    }
    throw e
  }
}

export const stealthexSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
