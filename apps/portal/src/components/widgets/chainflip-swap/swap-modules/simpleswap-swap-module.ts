// import { SwapModule } from './common.swap-module'
import {
  BaseQuote,
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  QuoteFunction,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
  toAssetAtom,
} from './common.swap-module'
import { QuoteResponse } from '@chainflip/sdk/swap'
import { Decimal } from '@talismn/math'
import { atom } from 'jotai'
import { mainnet, bsc, arbitrum, optimism, blast, polygon } from 'viem/chains'

const APIKEY = 'cd797f84-f852-4efe-9ab8-b49464c4d632'
const PROTOCOL = 'simpleswap'

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

const supportedEvmChains = {
  eth: mainnet,
  bsc: bsc,
  arbitrum: arbitrum,
  optimism: optimism,
  blast: blast,
  polygon: polygon,
}

type SimpleSwapAssetContext = {
  symbol: string
}

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
  }): Promise<string> => {
    const search = new URLSearchParams({
      api_key: APIKEY,
      fixed: `${props.fixed}`,
      currency_from: props.currencyFrom,
      currency_to: props.currencyTo,
      amount: props.amount,
    })
    const allCurrenciesRes = await fetch(`https://api.simpleswap.io/get_estimated?${search.toString()}`)
    return await allCurrenciesRes.json()
  },
}

const simpleswapAssetsAtom = atom(async () => {
  const allCurrencies = await simpleSwapSdk.getAllCurrencies()
  const supportedTokens = allCurrencies.filter(currency => {
    if (currency.isFiat) return false
    const isEvmNetwork = supportedEvmChains[currency.network as keyof typeof supportedEvmChains]
    const isSpecialAsset = specialAssets[currency.symbol]
    if (isEvmNetwork) {
      return currency.name.toLowerCase() === 'ethereum' || !!currency.contract_address
    }
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
  // const fromAsset = get(fromAssetAtom)
  // get tradable pairs
  return await get(simpleswapAssetsAtom)
})

const quote: QuoteFunction = async (get): Promise<(BaseQuote & { data?: QuoteResponse }) | null> => {
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)

  if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null
  const currencyFrom = fromAsset.context.simpleswap?.symbol
  const currencyTo = toAsset.context.simpleswap?.symbol
  if (!currencyFrom || !currencyTo) return null

  const output = await simpleSwapSdk.getEstimated({
    amount: fromAmount.toString(),
    currencyFrom,
    currencyTo,
    fixed: true,
  })
  return {
    protocol: PROTOCOL,
    inputAmountBN: fromAmount.planck,
    outputAmountBN: Decimal.fromUserInput(output, toAsset.decimals).planck,
    fees: null,
  }
}

const swap: SwapFunction<{ data: any }> = async () => {
  return {
    data: { data: '' },
    protocol: 'simpleswap',
  }
}

export const simpleswapSwapModule: SwapModule = {
  protocol: 'simpleswap',
  fromAssetsSelector,
  toAssetsSelector,
  getEstimateGasTx: async () => {
    return {
      type: 'evm',
      tx: {} as any,
      chainId: 0,
    }
  },
  quote,
  swap,
  decentralisationScore: 1,
}
