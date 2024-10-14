import { knownEvmNetworksAtom } from '../helpers'
import simpleswapLogo from '../side-panel/details/logos/simpleswap-logo.svg'
import {
  BaseQuote,
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  GetEstimateGasTxFunction,
  getTokenIdForSwappableAsset,
  QuoteFunction,
  saveAddressForQuest,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
  validateAddress,
  supportedEvmChains,
} from './common.swap-module'
import { substrateApiGetterAtom } from '@/domains/common'
import { QuoteResponse } from '@chainflip/sdk/swap'
import { chainsAtom } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { encodeAnyAddress } from '@talismn/util'
import { atom, Getter, Setter } from 'jotai'
import { atomFamily, loadable } from 'jotai/utils'
import { createPublicClient, encodeFunctionData, erc20Abi, http, isAddress } from 'viem'

const APIKEY = import.meta.env.REACT_APP_SIMPLESWAP_API_KEY
if (!APIKEY && import.meta.env.DEV) throw new Error('env var REACT_APP_SIMPLESWAP_API_KEY not set')
const PROTOCOL = 'simpleswap'
const PROTOCOL_NAME = 'SimpleSwap'
const DECENTRALISATION_SCORE = 1
const TALISMAN_FEE = 0.015

const LOGO = simpleswapLogo

type SimpleSwapCurrency = {
  name: string
  network: string
  symbol: string
  contract_address: string | null
  extra_id: string
  has_extra_id: boolean
  address_explorer: string
  confirmations_from: string
  image: string
  isFiat: boolean
}

type SimpleSwapAssetContext = {
  symbol: string
}

/**
 * specialAssets list defines a mappings of assets from simpleswap
 * to our internal asset representation. Many assets on simpleswap are not tradeable
 * in an onchain context because they dont come with contract addresses.
 * To avoid displaying a token which we dont have contract address for (which could result in a bunch of issues like, not being able to display the token balance, not being able to transfer the token for swapping and etc),
 * We support mainly 2 types of assets:
 * - ERC20 tokens: we only support ERC20 tokens from Simpleswap that comes with contract addresses
 * - Special assets: all substrate and evm native assets from simpleswap are whitelisted as special assets
 */
const specialAssets: Record<string, Omit<SwappableAssetBaseType, 'context'>> = {
  dot: {
    id: 'polkadot-substrate-native',
    name: 'Polkadot',
    symbol: 'DOT',
    chainId: 'polkadot',
    networkType: 'substrate',
  },
  ksm: {
    id: 'kusama-substrate-native',
    name: 'Kusama',
    symbol: 'KSM',
    chainId: 'kusama',
    networkType: 'substrate',
  },
  usdtdot: {
    id: 'polkadot-asset-hub-substrate-assets-1984-usdt',
    name: 'USDT (Polkadot)',
    chainId: 'polkadot-asset-hub',
    symbol: 'USDT',
    networkType: 'substrate',
    assetHubAssetId: 1984,
  },
  usdcdot: {
    id: 'polkadot-asset-hub-substrate-assets-1337-usdc',
    name: 'USDC (Polkadot)',
    chainId: 'polkadot-asset-hub',
    symbol: 'USDC',
    networkType: 'substrate',
    assetHubAssetId: 1337,
  },
  eth: {
    id: '1-evm-native',
    name: 'Ethereum',
    chainId: 1,
    symbol: 'ETH',
    networkType: 'evm',
  },
  etharb: {
    id: '42161-evm-native',
    name: 'Ethereum',
    chainId: 42161,
    symbol: 'ETH',
    networkType: 'evm',
  },
  ethop: {
    id: '10-evm-native',
    name: 'Ethereum',
    chainId: 10,
    symbol: 'ETH',
    networkType: 'evm',
  },
  ethmanta: {
    id: '169-evm-native',
    name: 'Ethereum (Manta Pacific)',
    chainId: 169,
    symbol: 'ETH',
    networkType: 'evm',
  },
  manta: {
    id: '169-evm-erc20-0x95cef13441be50d20ca4558cc0a27b601ac544e5',
    name: 'Manta Network',
    chainId: 169,
    symbol: 'MANTA',
    networkType: 'evm',
    contractAddress: '0x95cef13441be50d20ca4558cc0a27b601ac544e5',
  },
  tao: {
    id: 'bittensor-substrate-native',
    name: 'Bittensor',
    chainId: 'bittensor',
    symbol: 'TAO',
    networkType: 'substrate',
  },
  btc: {
    id: 'btc-native',
    name: 'Bitcoin',
    chainId: 'bitcoin',
    symbol: 'BTC',
    networkType: 'btc',
  },
  /** SS expects substrate address when swapping ASTR */
  astr: {
    id: 'astar-substrate-native',
    name: 'Astar',
    symbol: 'ASTR',
    chainId: 'astar',
    networkType: 'substrate',
  },
  azero: {
    id: 'aleph-zero-substrate-native',
    name: 'Aleph Zero',
    symbol: 'AZERO',
    chainId: 'aleph-zero',
    networkType: 'substrate',
  },
  /** SS expects substrate address when swapping ACA */
  aca: {
    id: 'acala-substrate-native',
    name: 'ACALA',
    symbol: 'ACA',
    chainId: 'acala',
    networkType: 'substrate',
  },
  /** SS expects EVM address when swapping GLMR */
  glmr: {
    id: '1284-evm-native',
    name: 'Moonbeam',
    symbol: 'GLMR',
    chainId: 'moonbeam',
    networkType: 'evm',
  },
  /** SS expects EVM address when swapping MOVR */
  movr: {
    id: '1285-evm-native',
    name: 'Moonriver',
    symbol: 'MOVR',
    chainId: 'moonriver',
    networkType: 'evm',
  },
  avail: {
    id: 'avail-substrate-native',
    name: 'Avail',
    symbol: 'AVAIL',
    chainId: 'avail',
    networkType: 'substrate',
  },
}

type Exchange = {
  id: string
  type: string
  timestamp: string
  updated_at: string
  valid_until: null
  currency_from: string
  currency_to: string
  amount_from: string
  expected_amount: string
  amount_to: string
  address_from: string
  address_to: string
  user_refund_address: string | null
  tx_from: null
  tx_to: null
  status: 'waiting' | 'finished' | 'failed'
  redirect_url: null
  currencies: Record<
    string,
    {
      name: string
      symbol: string
      network: string
      image: string
      warnings_from: string[]
      warnings_to: string[]
      validation_address: string
      address_explorer: string
      tx_explorer: string
      confirmations_from: string
      contract_address: string | null
      isFiat: boolean
    }
  >
  trace_id: string
  code?: number
  error?: string
}

const simpleSwapSdk = {
  getAllCurrencies: async (): Promise<SimpleSwapCurrency[]> => {
    const allCurrenciesRes = await fetch(`https://api.simpleswap.io/get_all_currencies?api_key=${APIKEY}`)
    return await allCurrenciesRes.json()
  },
  getEstimated: async (props: {
    currencyFrom: string
    currencyTo: string
    amount: string
    fixed: boolean
  }): Promise<string | { code: number; error: string; description: string; trace_id: string } | null> => {
    try {
      const search = new URLSearchParams({
        api_key: APIKEY,
        fixed: `${props.fixed}`,
        currency_from: props.currencyFrom,
        currency_to: props.currencyTo,
        amount: props.amount,
      })
      const allCurrenciesRes = await fetch(`https://api.simpleswap.io/get_estimated?${search.toString()}`)
      return await allCurrenciesRes.json()
    } catch (e) {
      console.error(e)
      return null
    }
  },
  getPairs: async (props: {
    symbol: string
    fixed: boolean
  }): Promise<string[] | { code: number; error: string; description: string; trace_id: string } | null> => {
    try {
      const search = new URLSearchParams({
        api_key: APIKEY,
        fixed: `${props.fixed}`,
        symbol: props.symbol,
      })
      const allPairs = await fetch(`https://api.simpleswap.io/get_pairs?${search.toString()}`)
      return await allPairs.json()
    } catch (e) {
      console.error(e)
      return null
    }
  },
  createExchange: async (props: {
    fixed: boolean
    currency_from: string
    currency_to: string
    amount: number
    address_to: string
    extra_id_to?: string
    user_refund_address: string | null
    user_refund_extra_id: string | null
  }): Promise<Exchange> => {
    const search = new URLSearchParams({
      api_key: APIKEY,
    })
    const exchange = await fetch(`https://api.simpleswap.io/create_exchange?${search.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    })

    return exchange.json()
  },
  getExchange: async (id: string): Promise<Exchange> => {
    const search = new URLSearchParams({
      api_key: APIKEY,
      id,
    })
    const exchange = await fetch(`https://api.simpleswap.io/get_exchange?${search.toString()}`)
    return exchange.json()
  },
}

const simpleswapAssetsAtom = atom(async () => {
  const allCurrencies = await simpleSwapSdk.getAllCurrencies()
  const supportedTokens = allCurrencies.filter(currency => {
    if (currency.isFiat) return false
    const isEvmNetwork = supportedEvmChains[currency.network as keyof typeof supportedEvmChains]
    const isSpecialAsset = specialAssets[currency.symbol]
    if (isEvmNetwork) {
      // evm assets must be whitelisted as a special asset or have a contract address
      return isSpecialAsset || !!currency.contract_address
    }
    // substrate assets must be whitelisted as a special asset
    return isSpecialAsset
  })

  return Object.values(
    supportedTokens.reduce((acc, cur) => {
      const evmChain = supportedEvmChains[cur.network as keyof typeof supportedEvmChains]
      const polkadotAsset = specialAssets[cur.symbol]
      const id = evmChain
        ? getTokenIdForSwappableAsset('evm', evmChain.id, cur.contract_address ? cur.contract_address : undefined)
        : polkadotAsset?.id
      const chainId = evmChain ? evmChain.id : polkadotAsset?.chainId
      if (!id || !chainId) return acc
      const asset: SwappableAssetBaseType<{ simpleswap: SimpleSwapAssetContext }> = {
        id,
        name: polkadotAsset?.name ?? cur.name,
        symbol: polkadotAsset?.symbol ?? cur.symbol,
        chainId,
        contractAddress: cur.contract_address ? cur.contract_address : undefined,
        image: cur.image,
        networkType: evmChain ? 'evm' : polkadotAsset?.networkType ?? 'substrate',
        assetHubAssetId: polkadotAsset?.assetHubAssetId,
        context: {
          simpleswap: {
            symbol: cur.symbol,
          },
        },
      }
      return { ...acc, [id]: asset }
    }, {} as Record<string, SwappableAssetBaseType>)
  )
})

export const fromAssetsSelector = atom(async get => {
  return await get(simpleswapAssetsAtom)
})

export const toAssetsSelector = atom(async get => {
  const allAssets = await get(simpleswapAssetsAtom)
  const fromAsset = get(fromAssetAtom)
  if (!fromAsset) return allAssets
  const symbol = fromAsset.context.simpleswap?.symbol
  if (!symbol) return [] // not supported
  const pairs = await simpleSwapSdk.getPairs({ symbol, fixed: false })
  if (!pairs || !Array.isArray(pairs)) return []
  return [
    fromAsset,
    ...allAssets.filter(asset => pairs.find(p => p.toLowerCase() === asset.context.simpleswap?.symbol.toLowerCase())),
  ]
})

const quote: QuoteFunction = loadable(
  atom(async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
    const substrateApiGetter = get(substrateApiGetterAtom)
    if (!substrateApiGetter) return null

    const getSubstrateApi = substrateApiGetter.getApi
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)

    try {
      if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null
      const currencyFrom = fromAsset.context.simpleswap?.symbol
      const currencyTo = toAsset.context.simpleswap?.symbol
      if (!currencyFrom || !currencyTo) return null

      // force refresh
      get(swapQuoteRefresherAtom)
      const output = await simpleSwapSdk.getEstimated({
        amount: fromAmount.toString(),
        currencyFrom,
        currencyTo,
        fixed: false,
      })

      // check for error object
      if (!output || typeof output !== 'string') {
        if (output && typeof output !== 'string') {
          return {
            decentralisationScore: DECENTRALISATION_SCORE,
            protocol: PROTOCOL,
            inputAmountBN: fromAmount.planck,
            outputAmountBN: 0n,
            error: output.description,
            timeInSec: 5 * 60,
            fees: [],
            providerLogo: LOGO,
            providerName: PROTOCOL_NAME,
            talismanFeeBps: TALISMAN_FEE,
          }
        }
        return null
      }

      const gasFee = await estimateGas(get, { getSubstrateApi })

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: Decimal.fromUserInput(output, toAsset.decimals).planck,
        // swaps take about 5mins according to their faq: https://simpleswap.io/faq#crypto-to-crypto-exchanges--how-long-does-it-take-to-exchange-coins
        timeInSec: 5 * 60,
        fees: gasFee ? [gasFee] : [],
        providerLogo: LOGO,
        providerName: PROTOCOL_NAME,
        talismanFeeBps: TALISMAN_FEE,
      }
    } catch (e) {
      console.error(e)
      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: 0n,
        timeInSec: 5 * 60,
        error: 'Error fetching quote',
        fees: [],
        providerLogo: LOGO,
        providerName: PROTOCOL_NAME,
        talismanFeeBps: TALISMAN_FEE,
      }
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
  const currency_from = fromAsset.context?.simpleswap?.symbol as string
  const currency_to = toAsset.context?.simpleswap?.symbol as string

  if (!currency_from) throw new Error('Missing currency from')
  if (!currency_to) throw new Error('Missing currency to')

  // validate from address for the source chain
  if (!validateAddress(addressFrom, fromAsset.networkType))
    throw new Error(`Cannot swap from ${fromAsset.chainId} chain with address: ${fromAddress}`)

  // validate to address for the target chain
  if (!validateAddress(addressTo, toAsset.networkType))
    throw new Error(`Cannot swap to ${toAsset.chainId} chain with address: ${toAddress}`)

  // cannot swap from BTC
  if (fromAsset.networkType === 'btc') throw new Error('Swapping from BTC is not supported.')

  const exchange = await simpleSwapSdk.createExchange({
    fixed: false,
    address_to: addressTo,
    amount: amount.toNumber(),
    currency_from,
    currency_to,
    extra_id_to: '',
    user_refund_address: null,
    user_refund_extra_id: null,
  })

  if (!exchange) throw new Error('Error creating exchange')

  // verify that the created exchange has the same assets we are trying to swap
  if (exchange.currency_from !== currency_from || exchange.currency_to !== currency_to)
    throw new Error('Incorrect currencies from provider. Please try again later')
  if (+exchange.expected_amount > amount.toNumber()) throw new Error('Quote changed. Please try again.')
  if (exchange.address_to !== addressTo)
    throw new Error('Incorrect destination address from provider. Please try again later')

  const depositAmount = Decimal.fromUserInput(exchange.expected_amount, fromAsset.decimals)
  try {
    if (fromAsset.networkType === 'evm') {
      if (!evmWalletClient) throw new Error('Ethereum account not connected')
      const chain = Object.values(supportedEvmChains).find(c => c.id.toString() === fromAsset.chainId.toString())
      if (!chain) throw new Error('Network not supported')
      await evmWalletClient.switchChain({ id: chain.id })

      if (!chain) throw new Error('Chain not found')
      if (!fromAsset.contractAddress) {
        await evmWalletClient.sendTransaction({
          chain,
          to: exchange.address_from as `0x${string}`,
          value: depositAmount.planck,
          account: fromAddress as `0x${string}`,
        })
      } else {
        await evmWalletClient.writeContract({
          chain,
          abi: erc20Abi,
          address: fromAsset.contractAddress as `0x${string}`,
          functionName: 'transfer',
          account: fromAddress as `0x${string}`,
          args: [exchange.address_from as `0x${string}`, depositAmount.planck],
        })
      }

      saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
      return { protocol: PROTOCOL, data: { id: exchange.id } }
    } else if (fromAsset.networkType === 'substrate') {
      const signer = substrateWallet?.signer
      if (!signer) throw new Error('Substrate wallet not connected.')
      const chains = await get(chainsAtom)
      const substrateChain = chains.find(c => c.id === fromAsset.chainId)
      const rpc = substrateChain?.rpcs?.[0]?.url
      if (!rpc) throw new Error('RPC not found!')
      const polkadotApi = await getSubstrateApi(substrateChain?.rpcs?.[0]?.url ?? '')

      await polkadotApi.tx.balances[allowReap ? 'transferAllowDeath' : 'transferKeepAlive'](
        exchange.address_from,
        depositAmount.planck
      ).signAndSend(addressFrom, { signer, withSignedTransaction: true })

      saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
      return { protocol: PROTOCOL, data: { id: exchange.id } }
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
    const evmChain = Object.values(supportedEvmChains).find(c => c.id.toString() === fromAsset.chainId.toString())

    const data = fromAsset.contractAddress
      ? encodeFunctionData({ abi: erc20Abi, functionName: 'transfer', args: [fromAddress, 0n] })
      : undefined

    if (network && evmChain) {
      const client = createPublicClient({ transport: http(network.rpcs[0]), chain: evmChain })
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

  const transferTx = polkadotApi.tx.balances.transferAllowDeath(fromAddress, fromAmount.planck)
  const decimals = transferTx.registry.chainDecimals[0] ?? 10 // default to polkadot decimals 10
  const symbol = transferTx.registry.chainTokens[0] ?? 'DOT' // default to polkadot symbol 'DOT'
  const paymentInfo = await transferTx.paymentInfo(fromAddress)
  return {
    name: 'Est. Gas Fees',
    tokenId: substrateChain?.nativeToken?.id ?? 'polkadot-substrate-native',
    amount: Decimal.fromPlanck(paymentInfo.partialFee.toBigInt(), decimals, { currency: symbol }),
  }
}

export const simpleswapSwapModule: SwapModule = {
  protocol: 'simpleswap',
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
): Promise<{ exchange: Exchange; expired?: boolean }> => {
  try {
    const exchange = await simpleSwapSdk.getExchange(id)
    const expired = false

    if (exchange.status !== 'finished' && exchange.code !== 401) {
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

export const simpleswapSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
