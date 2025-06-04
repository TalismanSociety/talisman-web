import type { Chain as ViemChain } from 'viem/chains'
import { QuoteResponse } from '@chainflip/sdk/swap'
import { chainsAtom } from '@talismn/balances-react'
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
import {
  BaseQuote,
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  GetEstimateGasTxFunction,
  getTokenIdForSwappableAsset,
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
const TALISMAN_TOTAL_FEE = 0.01 // We take a fee of 1.0%
const BUILT_IN_FEE = 0.004 // StealthEX always includes an affiliate fee of 0.4%
const TALISMAN_ADDITIONAL_FEE = TALISMAN_TOTAL_FEE - BUILT_IN_FEE // We want a total fee of 1.5%, so subtract the built-in fee of 0.4%
// Our UI represents a 1% fee as `0.01`, but the StealthEX api represents a 1% fee as `1.0`.
// 1.0 = 0.01 * 100
const additional_fee_percent = TALISMAN_ADDITIONAL_FEE * 100

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
  getAllCurrencies: async (): Promise<StealthexCurrency[]> => {
    const allCurrencies: StealthexCurrency[] = []

    // TODO: When worker cache isn't warm, this takes too long to fetch all requests.
    const limit = 250
    for (let offset = 0; ; offset += limit) {
      const { data: currencies } = await api.GET('/v4/currencies', { params: { query: { limit, offset } } })
      if (!Array.isArray(currencies)) break

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
    routeHasCustomFee,
    estimation,
    rate,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    routeHasCustomFee: boolean
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
  }): Promise<{ min: BigNumber }> => {
    // default values
    estimation ||= 'direct'
    rate ||= 'floating'

    const params = {
      route,
      estimation,
      rate,
      additional_fee_percent: routeHasCustomFee ? additional_fee_percent : undefined,
    }
    if (!routeHasCustomFee) delete params.additional_fee_percent

    const { data: range, error } = await api.POST('/v4/rates/range', { body: params })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return { min: BigNumber(range?.min_amount ?? 0) }
  },
  getEstimate: async ({
    route,
    routeHasCustomFee,
    amount,
    estimation,
    rate,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    routeHasCustomFee: boolean
    amount: number
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
  }): Promise<number> => {
    // default values
    estimation ||= 'direct'
    rate ||= 'floating'

    const params = {
      route,
      amount,
      estimation,
      rate,
      additional_fee_percent: routeHasCustomFee ? additional_fee_percent : undefined,
    }
    if (!routeHasCustomFee) delete params.additional_fee_percent

    const { data: estimate, error } = await api.POST('/v4/rates/estimated-amount', { body: params })
    if (error) throw new Error(`${error.err.kind}: ${error.err.details}`)
    return estimate?.estimated_amount
  },
  createExchange: async ({
    route,
    routeHasCustomFee,
    amount,
    estimation,
    rate,
    address,
    extra_id,
    refund_address,
    refund_extra_id,
  }: {
    route: { from: { network: string; symbol: string }; to: { network: string; symbol: string } }
    routeHasCustomFee: boolean
    amount: number
    estimation?: 'direct' | 'reversed'
    rate?: 'floating' | 'fixed'
    address: string
    extra_id?: string
    refund_address?: string
    refund_extra_id?: string
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
      additional_fee_percent: routeHasCustomFee ? additional_fee_percent : undefined,
    }
    if (extra_id === undefined) delete params.extra_id
    if (refund_address === undefined) delete params.refund_address
    if (refund_extra_id === undefined) delete params.refund_extra_id
    if (!routeHasCustomFee) delete params.additional_fee_percent

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

const assetsAtom = atom(async () => {
  const allCurrencies = await stealthexSdk.getAllCurrencies()

  const supportedTokens = allCurrencies.filter(currency => {
    const isEvmNetwork = !!supportedEvmChains[currency.network]
    const isSpecialAsset = !!specialAssets[`${currency.network}::${currency.symbol}`]

    // evm assets must be whitelisted as a special asset or have a contract address
    if (isEvmNetwork) return isSpecialAsset || !!currency.contract_address

    // substrate assets must be whitelisted as a special asset
    return isSpecialAsset
  })

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

      const asset: SwappableAssetBaseType<{ stealthex: AssetContext }> = {
        id,
        name: specialAsset?.name ?? currency.name,
        symbol: specialAsset?.symbol ?? currency.symbol,
        chainId,
        contractAddress: currency.contract_address ? currency.contract_address : undefined,
        image: currency.icon_url,
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
  atom(async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
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

    const range = await stealthexSdk.getRange({ route: { from, to }, routeHasCustomFee })
    if (range && range.min.isGreaterThan(fromAmount.toString()))
      throw new Error(`StealthEX minimum is ${range.min.toString()} ${fromAsset.symbol}`)

    try {
      // TODO: Return `null` or an error when getRange / getEstimate fails
      // Error format: `return { decentralisationScore: DECENTRALISATION_SCORE, protocol: PROTOCOL, inputAmountBN: fromAmount.planck, outputAmountBN: 0n, error: '<error here>', timeInSec: 5 * 60, fees: [], providerLogo: LOGO, providerName: PROTOCOL_NAME, talismanFeeBps: TALISMAN_TOTAL_FEE, }`
      const estimate = await stealthexSdk.getEstimate({
        route: { from, to },
        routeHasCustomFee,
        amount: fromAmount.toNumber(),
      })

      const gasFee = await estimateGas(get, { getSubstrateApi })

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: Decimal.fromUserInput(String(estimate), toAsset.decimals).planck,
        // simpleswap swaps take about 5mins, assuming here that stealthex takes a similar amount of time
        timeInSec: 5 * 60,
        fees: gasFee ? [gasFee] : [],
        providerLogo: LOGO,
        providerName: PROTOCOL_NAME,
        talismanFeeBps: routeHasCustomFee ? TALISMAN_TOTAL_FEE : BUILT_IN_FEE,
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

  const exchange = await stealthexSdk.createExchange({
    route: { from, to },
    routeHasCustomFee,
    amount: amount.toNumber(),
    address: addressTo,
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
        amount: Decimal.fromPlanck(gasPrice * gasLimit, network.nativeToken.decimals, {
          currency: network.nativeToken.symbol,
        }),
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
  const symbol = transferTx.registry.chainTokens[0] ?? 'DOT' // default to polkadot symbol 'DOT'
  const paymentInfo = await transferTx.paymentInfo(fromAddress)
  return {
    name: 'Est. Gas Fees',
    tokenId: substrateChain?.nativeToken?.id ?? 'polkadot-substrate-native',
    amount: Decimal.fromPlanck(paymentInfo.partialFee.toBigInt(), decimals, { currency: symbol }),
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
