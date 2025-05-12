import type { Chain as ViemChain } from 'viem/chains'
import { QuoteResponse } from '@chainflip/sdk/swap'
import { chainsAtom } from '@talismn/balances-react'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { atom, Getter, Setter } from 'jotai'
import { atomFamily, loadable } from 'jotai/utils'
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
  SchemaCurrency as StealthexCurrency,
  SchemaEstimate as StealthexEstimate,
  SchemaExchange as StealthexExchange,
  SchemaRange as StealthexRange,
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
const TALISMAN_FEE = 0.015

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

const stealthexSdk = {
  getAllCurrencies: async (): Promise<StealthexCurrency[]> => {
    const allCurrencies: StealthexCurrency[] = []

    // TODO: When worker cache isn't warm, this takes too long to fetch all requests.
    const limit = 250
    for (let offset = 0; ; offset += limit) {
      const response = await fetch(`${apiUrl}/v4/currencies?limit=${limit}&offset=${offset}`)
      const currencies: StealthexCurrency[] = await response.json()
      if (!Array.isArray(currencies)) break

      allCurrencies.push(...currencies)
      if (currencies.length !== 250) break
    }

    return allCurrencies
  },
  // getEstimated: async (props: {
  //   currencyFrom: string
  //   currencyTo: string
  //   amount: string
  //   fixed: boolean
  // }): Promise<string | { code: number; error: string; description: string; trace_id: string } | null> => {
  //   try {
  //     const search = new URLSearchParams({
  //       api_key: APIKEY,
  //       fixed: `${props.fixed}`,
  //       currency_from: props.currencyFrom,
  //       currency_to: props.currencyTo,
  //       amount: props.amount,
  //     })
  //     const allCurrenciesRes = await fetch(`https://api.simpleswap.io/get_estimated?${search.toString()}`)
  //     return await allCurrenciesRes.json()
  //   } catch (e) {
  //     console.error(e)
  //     return null
  //   }
  // },
  // getPairs: async (props: {
  //   symbol: string
  //   fixed: boolean
  // }): Promise<string[] | { code: number; error: string; description: string; trace_id: string } | null> => {
  //   try {
  //     const search = new URLSearchParams({
  //       api_key: APIKEY,
  //       fixed: `${props.fixed}`,
  //       symbol: props.symbol,
  //     })
  //     const allPairs = await fetch(`https://api.simpleswap.io/get_pairs?${search.toString()}`)
  //     return await allPairs.json()
  //   } catch (e) {
  //     console.error(e)
  //     return null
  //   }
  // },
  // createExchange: async (props: {
  //   fixed: boolean
  //   currency_from: string
  //   currency_to: string
  //   amount: number
  //   address_to: string
  //   extra_id_to?: string
  //   user_refund_address: string | null
  //   user_refund_extra_id: string | null
  // }): Promise<Exchange> => {
  //   const search = new URLSearchParams({
  //     api_key: APIKEY,
  //   })
  //   const exchange = await fetch(`https://api.simpleswap.io/create_exchange?${search.toString()}`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(props),
  //   })

  //   return exchange.json()
  // },
  // getExchange: async (id: string): Promise<Exchange> => {
  //   const search = new URLSearchParams({
  //     api_key: APIKEY,
  //     id,
  //   })
  //   const exchange = await fetch(`https://api.simpleswap.io/get_exchange?${search.toString()}`)
  //   return exchange.json()
  // },
  // getRange: async (props: { currency_from: string; currency_to: string }): Promise<Range | undefined> => {
  //   const search = new URLSearchParams({
  //     api_key: APIKEY,
  //     fixed: 'false',
  //     ...props,
  //   })
  //   const json:
  //     | { min?: string; trace_id?: string }
  //     | { code?: number; error?: string; description?: string; trace_id?: string } = await (
  //     await fetch(`https://api.simpleswap.io/get_ranges?${search.toString()}`)
  //   ).json()

  //   if ('error' in json) throw new Error(json.error)
  //   if (!('min' in json)) return

  //   if (typeof json.min !== 'string') return

  //   return { min: BigNumber(json.min) }
  // },
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
    }, {} as Record<string, SwappableAssetBaseType>)
  )
})

export const fromAssetsSelector = atom(async get => await get(assetsAtom))
export const toAssetsSelector = atom(async get => {
  const allAssets = await get(assetsAtom)
  const fromAsset = get(fromAssetAtom)
  if (!fromAsset) return allAssets
  // const symbol = fromAsset.context.simpleswap?.symbol
  // if (!symbol) return [] // not supported
  // const pairs = await simpleSwapSdk.getPairs({ symbol, fixed: false })
  // if (!pairs || !Array.isArray(pairs)) return []
  // return [
  //   fromAsset,
  //   ...allAssets.filter(asset => pairs.find(p => p.toLowerCase() === asset.context.simpleswap?.symbol.toLowerCase())),
  // ]
})

const quote: QuoteFunction = loadable(
  atom(async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
    const substrateApiGetter = get(substrateApiGetterAtom)
    if (!substrateApiGetter) return null

    //   const getSubstrateApi = substrateApiGetter.getApi
    //   const fromAsset = get(fromAssetAtom)
    //   const toAsset = get(toAssetAtom)
    //   const fromAmount = get(fromAmountAtom)

    //   if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null
    //   const currencyFrom = fromAsset.context.simpleswap?.symbol
    //   const currencyTo = toAsset.context.simpleswap?.symbol
    //   if (!currencyFrom || !currencyTo) return null

    //   // force refresh
    //   get(swapQuoteRefresherAtom)

    //   const range = await simpleSwapSdk.getRange({ currency_from: currencyFrom, currency_to: currencyTo })
    //   if (range && range.min.isGreaterThan(fromAmount.toString()))
    //     throw new Error(`SimpleSwap minimum is ${range.min.toString()} ${fromAsset.symbol}`)

    //   const output = await simpleSwapSdk.getEstimated({
    //     amount: fromAmount.toString(),
    //     currencyFrom,
    //     currencyTo,
    //     fixed: false,
    //   })

    //   // check for error object
    //   if (!output || typeof output !== 'string') {
    //     if (output && typeof output !== 'string') {
    //       return {
    //         decentralisationScore: DECENTRALISATION_SCORE,
    //         protocol: PROTOCOL,
    //         inputAmountBN: fromAmount.planck,
    //         outputAmountBN: 0n,
    //         error: output.description,
    //         timeInSec: 5 * 60,
    //         fees: [],
    //         providerLogo: LOGO,
    //         providerName: PROTOCOL_NAME,
    //         talismanFeeBps: TALISMAN_FEE,
    //       }
    //     }
    //     return null
    //   }

    //   const gasFee = await estimateGas(get, { getSubstrateApi })

    //   return {
    //     decentralisationScore: DECENTRALISATION_SCORE,
    //     protocol: PROTOCOL,
    //     inputAmountBN: fromAmount.planck,
    //     outputAmountBN: Decimal.fromUserInput(output, toAsset.decimals).planck,
    //     // swaps take about 5mins according to their faq: https://simpleswap.io/faq#crypto-to-crypto-exchanges--how-long-does-it-take-to-exchange-coins
    //     timeInSec: 5 * 60,
    //     fees: gasFee ? [gasFee] : [],
    //     providerLogo: LOGO,
    //     providerName: PROTOCOL_NAME,
    //     talismanFeeBps: TALISMAN_FEE,
    //   }
  })
)
// const saveIdForMonitoring = async (swapId: string, txHash: string) => {
//   await fetch(`https://swap-providers-monitor.fly.dev/simpleswap/exchange`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ id: swapId, deposit_tx_hash: txHash }),
//   })
// }

const swap: SwapFunction<{ id: string }> = async (
  get: Getter,
  _: Setter,
  { evmWalletClient, getSubstrateApi, substrateWallet, allowReap }
) => {
  // const toAddress = get(toAddressAtom)
  // const fromAddress = get(fromAddressAtom)
  // const amount = get(fromAmountAtom)
  // const fromAsset = get(fromAssetAtom)
  // const toAsset = get(toAssetAtom)
  // const substrateChains = await get(chainsAtom)
  // let addressTo = toAddress
  // if (toAsset?.networkType === 'substrate' && addressTo) {
  //   const substrateChain = substrateChains.find(c => c.id.toString() === toAsset.chainId.toString())
  //   if (substrateChain) {
  //     addressTo = encodeAnyAddress(addressTo, substrateChain.prefix ?? 42)
  //   }
  // }
  // if (!addressTo) throw new Error('Missing to address')
  // let addressFrom = fromAddress
  // if (fromAsset?.networkType === 'substrate' && addressFrom) {
  //   const substrateChain = substrateChains.find(c => c.id.toString() === fromAsset.chainId.toString())
  //   if (substrateChain) {
  //     addressFrom = encodeAnyAddress(addressFrom, substrateChain.prefix ?? 42)
  //   }
  // }
  // if (!addressFrom) throw new Error('Missing from address')
  // if (!fromAsset) throw new Error('Missing from asset')
  // if (!toAsset) throw new Error('Missing to asset')
  // const currency_from = fromAsset.context?.simpleswap?.symbol as string
  // const currency_to = toAsset.context?.simpleswap?.symbol as string
  // if (!currency_from) throw new Error('Missing currency from')
  // if (!currency_to) throw new Error('Missing currency to')
  // // validate from address for the source chain
  // if (!validateAddress(addressFrom, fromAsset.networkType))
  //   throw new Error(`Cannot swap from ${fromAsset.chainId} chain with address: ${fromAddress}`)
  // // validate to address for the target chain
  // if (!validateAddress(addressTo, toAsset.networkType))
  //   throw new Error(`Cannot swap to ${toAsset.chainId} chain with address: ${toAddress}`)
  // // cannot swap from BTC
  // if (fromAsset.networkType === 'btc') throw new Error('Swapping from BTC is not supported.')
  // const exchange = await simpleSwapSdk.createExchange({
  //   fixed: false,
  //   address_to: addressTo,
  //   amount: amount.toNumber(),
  //   currency_from,
  //   currency_to,
  //   extra_id_to: '',
  //   user_refund_address: null,
  //   user_refund_extra_id: null,
  // })
  // if (!exchange) throw new Error('Error creating exchange')
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
  // // verify that the created exchange has the same assets we are trying to swap
  // if (exchange.currency_from !== currency_from || exchange.currency_to !== currency_to)
  //   throw new Error('Incorrect currencies from provider. Please try again later')
  // if (+exchange.expected_amount > amount.toNumber()) throw new Error('Quote changed. Please try again.')
  // if (exchange.address_to !== addressTo)
  //   throw new Error('Incorrect destination address from provider. Please try again later')
  // const depositAmount = Decimal.fromUserInput(exchange.expected_amount, fromAsset.decimals)
  // try {
  //   if (fromAsset.networkType === 'evm') {
  //     if (!evmWalletClient) throw new Error('Ethereum account not connected')
  //     const chain = Object.values(supportedEvmChains).find(c => c?.id.toString() === fromAsset.chainId.toString())
  //     if (!chain) throw new Error('Network not supported')
  //     await evmWalletClient.switchChain({ id: chain.id })
  //     if (!chain) throw new Error('Chain not found')
  //     let hash: string
  //     if (!fromAsset.contractAddress) {
  //       hash = await evmWalletClient.sendTransaction({
  //         chain,
  //         to: exchange.address_from as `0x${string}`,
  //         value: depositAmount.planck,
  //         account: fromAddress as `0x${string}`,
  //       })
  //     } else {
  //       hash = await evmWalletClient.writeContract({
  //         chain,
  //         abi: erc20Abi,
  //         address: fromAsset.contractAddress as `0x${string}`,
  //         functionName: 'transfer',
  //         account: fromAddress as `0x${string}`,
  //         args: [exchange.address_from as `0x${string}`, depositAmount.planck],
  //       })
  //     }
  //     saveIdForMonitoring(exchange.id, hash)
  //     saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
  //     return {
  //       protocol: PROTOCOL,
  //       depositRes: {
  //         txHash: hash,
  //         chainId: chain.id,
  //       },
  //       data: { id: exchange.id },
  //     }
  //   } else if (fromAsset.networkType === 'substrate') {
  //     const signer = substrateWallet?.signer
  //     if (!signer) throw new Error('Substrate wallet not connected.')
  //     const chains = await get(chainsAtom)
  //     const substrateChain = chains.find(c => c.id === fromAsset.chainId)
  //     const rpc = substrateChain?.rpcs?.[0]?.url
  //     if (!rpc) throw new Error('RPC not found!')
  //     const polkadotApi = await getSubstrateApi(rpc)
  //     const transferRes =
  //       fromAsset.assetHubAssetId !== undefined
  //         ? await substrateAssetsSwapTransfer(
  //             polkadotApi,
  //             allowReap,
  //             exchange.address_from,
  //             addressFrom,
  //             fromAsset.assetHubAssetId,
  //             depositAmount.planck,
  //             signer
  //           )
  //         : await substrateNativeSwapTransfer(
  //             polkadotApi,
  //             allowReap,
  //             exchange.address_from,
  //             addressFrom,
  //             depositAmount.planck,
  //             signer
  //           )
  //     if (transferRes.ok) {
  //       saveIdForMonitoring(exchange.id, transferRes.id)
  //       saveAddressForQuest(exchange.id, addressFrom, PROTOCOL)
  //     }
  //     return {
  //       protocol: PROTOCOL,
  //       depositRes: {
  //         extrinsicId: transferRes.id,
  //         chainId: substrateChain.id,
  //         error: transferRes.error,
  //       },
  //       data: { id: exchange.id },
  //     }
  //   }
  // } catch (e) {
  //   console.error(e)
  //   // TODO: convert to user friendly error messages
  //   throw e
  // }
  // throw new Error('Unsupported network')
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

// const retryStatus = async (
//   get: Getter,
//   id: string,
//   attempts = 0
// ): Promise<{ exchange: Exchange; expired?: boolean }> => {
//   try {
//     const exchange = await simpleSwapSdk.getExchange(id)
//     const expired = false

//     if (exchange.status !== 'finished' && exchange.code !== 401) {
//       get(swapQuoteRefresherAtom)
//     }

//     return { exchange, expired }
//   } catch (e) {
//     const error = e as Error & { response?: { status: number } }
//     // because we're using a broker, the tx isnt always available immediately in their api service
//     // so we wait a bit and retry
//     if (error.name === 'AxiosError' && error?.response?.status === 404 && attempts < 10) {
//       await new Promise(resolve => setTimeout(resolve, 5000))
//       return retryStatus(get, id, attempts + 1)
//     }
//     throw e
//   }
// }

// export const simpleswapSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
