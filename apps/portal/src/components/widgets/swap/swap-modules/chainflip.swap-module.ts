import type {
  AssetData,
  Chain,
  ChainData,
  ChainflipNetwork,
  QuoteResponseV2,
  SwapStatusResponseV2,
} from '@chainflip/sdk/swap'
import type { Getter, Setter } from 'jotai'
import type { Chain as ViemChain } from 'viem/chains'
import { Asset, SwapSDK } from '@chainflip/sdk/swap'
import { chainsAtom, tokensByIdAtom } from '@talismn/balances-react'
import { githubUnknownTokenLogoUrl, TokenList } from '@talismn/chaindata-provider'
import { encodeAnyAddress } from '@talismn/util'
import BigNumber from 'bignumber.js'
import { atom } from 'jotai'
import { atomFamily, loadable } from 'jotai/utils'
import { createPublicClient, encodeFunctionData, erc20Abi, fallback, http, isAddress } from 'viem'
import { arbitrum, mainnet, sepolia } from 'viem/chains'

import { substrateApiGetterAtom } from '@/domains/common/recoils/api'
import { Decimal } from '@/util/Decimal'

import type {
  BaseQuote,
  GetEstimateGasTxFunction,
  QuoteFunction,
  SupportedSwapProtocol,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
} from './common.swap-module'
import { knownEvmNetworksAtom } from '../helpers'
import chainflipLogo from '../side-panel/details/logos/chainflip-logo.png'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  getTokenIdForSwappableAsset,
  saveAddressForQuest,
  substrateNativeSwapTransfer,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
  validateAddress,
} from './common.swap-module'

const PROTOCOL: SupportedSwapProtocol = 'chainflip' as const
const PROTOCOL_NAME = 'Chainflip'
const DECENTRALISATION_SCORE = 2
const CHAINFLIP_COMMISSION = 0.015 // We take a fee of 1.5%
const brokerCommissionBps = CHAINFLIP_COMMISSION * 10_000 // to bps

const EVM_CHAINS: ViemChain[] = [mainnet, sepolia, arbitrum]

const CHAINFLIP_CHAIN_TO_ID_MAP: Record<Exclude<Chain, 'Solana'>, string> = {
  Arbitrum: '42161',
  Ethereum: '1',
  Polkadot: 'polkadot',
  Bitcoin: 'bitcoin',
  Assethub: 'polkadot-asset-hub',
}

const CHAINFLIP_ID_TO_CHAIN_MAP: Record<string, Exclude<Chain, 'Solana'>> = {
  '42161': 'Arbitrum',
  '421614': 'Arbitrum', // arbitrum testnet
  '1': 'Ethereum',
  '11155111': 'Ethereum', // sepolia testnet
  polkadot: 'Polkadot',
  bitcoin: 'Bitcoin',
  'polkadot-asset-hub': 'Assethub',
}

type ChainflipAssetContext = {
  chain: Chain
  asset: Asset
}

/**
 * Given an asset and chain from chainflip, convert it to a unified swappable asset type
 */
export const chainflipAssetToSwappableAsset = (
  asset: AssetData,
  chain: ChainData,
  tokensById: TokenList
): SwappableAssetBaseType<{ chainflip: ChainflipAssetContext }> | null => {
  const chainId =
    chain.evmChainId?.toString() ?? CHAINFLIP_CHAIN_TO_ID_MAP[chain.chain as Exclude<Chain, 'Solana'>] ?? 'unsupported'
  const networkType = ['Polkadot', 'Assethub'].includes(chain.chain)
    ? 'substrate'
    : chain.chain === 'Bitcoin'
    ? 'btc'
    : 'evm'
  const id = getTokenIdForSwappableAsset(networkType, chainId, asset.contractAddress)
  if (chainId === 'unsupported') return null
  const image = tokensById[id]?.logo !== githubUnknownTokenLogoUrl ? tokensById[id]?.logo : undefined
  return {
    id,
    name: asset.name,
    symbol: asset.symbol,
    chainId,
    contractAddress: asset.contractAddress,
    image,
    networkType,
    context: {
      chainflip: {
        chain: chain.chain,
        asset: asset.asset,
      },
    },
  }
}

const swappableAssetToChainflipAsset = (
  swappableAsset: SwappableAssetBaseType,
  assets: AssetData[]
): AssetData | undefined => {
  const chain = CHAINFLIP_ID_TO_CHAIN_MAP[swappableAsset.chainId.toString()]
  return assets.find(a => {
    if (a.chain !== chain) return false
    if (['Polkadot', 'Assethub'].includes(chain)) {
      return a.asset === 'DOT'
    } else if (chain === 'Bitcoin') {
      return a.chain === chain
    } else if (swappableAsset.contractAddress) {
      return a.contractAddress?.toLowerCase() === swappableAsset.contractAddress.toLowerCase()
    } else {
      // we're likely looking for native asset at this point, just double check that the symbol matches
      return !a.contractAddress && a.symbol.toLowerCase() === swappableAsset.symbol.toLowerCase()
    }
  })
}

const chainflipNetworkAtom = atom<ChainflipNetwork>('mainnet')
export const polkadotRpcAtom = atom(get =>
  get(chainflipNetworkAtom) === 'mainnet' ? 'wss://polkadot.api.onfinality.io/public' : 'wss://rpc-pdot.chainflip.io'
)

const brokerUrlAtom = atom(get => {
  switch (get(chainflipNetworkAtom)) {
    case 'mainnet':
      return `https://chainflip-broker.io/rpc/${import.meta.env.VITE_CHAINFLIP_API_KEY}`
    case 'perseverance':
      return 'https://perseverance.chainflip-broker.io/rpc/93c2bff017e243f29ffb14e42dccbec8'
    default:
      return undefined
  }
})

const swapSdkAtom = atom(get => {
  const network = get(chainflipNetworkAtom)
  const brokerUrl = get(brokerUrlAtom)
  return new SwapSDK({
    network,
    broker: brokerUrl ? { url: brokerUrl, commissionBps: brokerCommissionBps } : undefined,
  })
})

export const chainflipAssetsAtom = atom(async get =>
  (await get(swapSdkAtom).getAssets()).filter(a => a.asset !== 'FLIP')
)
export const chainflipChainsAtom = atom(async get => await get(swapSdkAtom).getChains())

const tokensSelector = atom(async (get): Promise<SwappableAssetBaseType[]> => {
  const assets = await get(chainflipAssetsAtom)
  const chains = await get(chainflipChainsAtom)
  const tokensById = await get(tokensByIdAtom)
  const tokens: SwappableAssetBaseType[] = []

  for (const asset of assets) {
    const chain = chains.find(chain => chain.chain === asset.chain)
    // for safety measure only, unless chainflip has bug
    if (!chain) continue
    const swappableAsset = chainflipAssetToSwappableAsset(asset, chain, tokensById)
    if (swappableAsset) tokens.push(swappableAsset)
  }

  return tokens.sort((a, b) => {
    if (a.symbol === 'FLIP') return 1
    if (b.symbol === 'FLIP') return -1
    return 0
  })
})

const fromAssetsSelector = atom(async get => await get(tokensSelector))
const toAssetsSelector = atom(async get => await get(tokensSelector))

const quote: QuoteFunction = loadable(
  atom(async (get): Promise<BaseQuote<QuoteResponseV2['quotes'][number]> | null> => {
    const substrateApiGetter = get(substrateApiGetterAtom)
    if (!substrateApiGetter) return null

    const getSubstrateApi = substrateApiGetter.getApi
    const sdk = get(swapSdkAtom)
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)
    const assets = await get(chainflipAssetsAtom)
    const chains = await get(chainflipChainsAtom)
    if (!fromAsset || !toAsset || !fromAmount || fromAmount.planck === 0n) return null

    const chainflipFromAsset = assets.find(
      asset =>
        asset.symbol.toLowerCase() === fromAsset.symbol.toLowerCase() &&
        asset.chain === CHAINFLIP_ID_TO_CHAIN_MAP[fromAsset.chainId.toString()]
    )
    const chainflipToAsset = assets.find(
      asset =>
        asset.symbol.toLowerCase() === toAsset.symbol.toLowerCase() &&
        asset.chain === CHAINFLIP_ID_TO_CHAIN_MAP[toAsset.chainId.toString()]
    )
    // asset not supported
    if (!chainflipFromAsset || !chainflipToAsset) return null

    const minFromAmount = Decimal.fromPlanck(chainflipFromAsset.minimumSwapAmount, chainflipFromAsset.decimals)
    if (fromAmount.planck < minFromAmount.planck)
      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: 0n,
        error: `Minimum input amount: ${minFromAmount.toLocaleString()} ${fromAsset.symbol}`,
        fees: [],
        timeInSec: 0,
        providerLogo: chainflipLogo,
        providerName: PROTOCOL_NAME,
      }

    try {
      // force refresh
      get(swapQuoteRefresherAtom)
      const quoteResp = await sdk.getQuoteV2({
        amount: fromAmount.planck.toString(),
        srcAsset: chainflipFromAsset.asset,
        destAsset: chainflipToAsset.asset,
        srcChain: chainflipFromAsset.chain,
        destChain: chainflipToAsset.chain,
        brokerCommissionBps,
      })

      // In the time since we integrated chainflip, the sdk has made it possible to get multiple quotes for a request.
      // Until we refactor this module to handle multiple quotes, we'll take the first REGULAR quote with the most amount of output tokens.
      const quote = quoteResp.quotes
        .filter(q => q.type === 'REGULAR')
        .sort((a, b) => {
          // If a < b, b should come first
          if (BigInt(a.egressAmount) < BigInt(b.egressAmount)) return 1
          // If a > b, a should come first
          if (BigInt(a.egressAmount) > BigInt(b.egressAmount)) return -1
          return 0
        })[0]
      if (!quote) throw new Error('No quote found')

      const tokensById = await get(tokensByIdAtom)
      const fees = quote.includedFees
        .map(fee => {
          const asset = assets.find(a => a.chain === fee.chain && a.asset === fee.asset)
          const chain = chains.find(c => c.chain === fee.chain)
          if (!asset || !chain) return null

          const swappableAsset = chainflipAssetToSwappableAsset(asset, chain, tokensById)
          if (!swappableAsset) return null

          // get rate and compute fee in fiat
          const amount = BigNumber(fee.amount).times(10 ** -asset.decimals)
          return { name: fee.type.toLowerCase(), tokenId: swappableAsset.id, amount }
        })
        .filter(fee => fee !== null)

      const gasFee = await estimateGas(get, { getSubstrateApi })
      if (gasFee) fees.push(gasFee)

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: BigInt(quote.egressAmount),
        talismanFee: CHAINFLIP_COMMISSION,
        fees,
        data: quote,
        timeInSec: quote.estimatedDurationSeconds,
        providerLogo: chainflipLogo,
        providerName: PROTOCOL_NAME,
      }
    } catch (_error) {
      console.error(_error)
      const error = _error as Error & { response?: { data?: { message: string } } }
      const errorMessage =
        error.name === 'AxiosError'
          ? error.response?.data?.message.includes('InsufficientLiquidity') ||
            error.response?.data?.message.toLowerCase().includes('insufficient liquidity')
            ? 'Chainflip: Insufficient liquidity. Please try again with a smaller amount'
            : `Chainflip: ${error.response?.data?.message}`
          : error.message ?? 'Unknown error'

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        protocol: PROTOCOL,
        inputAmountBN: fromAmount.planck,
        outputAmountBN: 0n,
        error: errorMessage,
        fees: [],
        timeInSec: 0,
        providerLogo: chainflipLogo,
        providerName: PROTOCOL_NAME,
      }
    }
  })
)

export type ChainflipSwapActivityData = {
  id: string
  network: ChainflipNetwork
}

const swap: SwapFunction<ChainflipSwapActivityData> = async (
  get: Getter,
  _: Setter,
  { evmWalletClient, getSubstrateApi, substrateWallet, allowReap }
) => {
  const sdk = get(swapSdkAtom)
  const network = get(chainflipNetworkAtom)
  const fromAsset = get(fromAssetAtom)
  const toAsset = get(toAssetAtom)
  const fromAmount = get(fromAmountAtom)
  const fromAddress = get(fromAddressAtom)
  const toAddress = get(toAddressAtom)
  const assets = await get(chainflipAssetsAtom)
  const chains = await get(chainflipChainsAtom)

  // make sure we have all the parameters we need
  if (!fromAsset) throw new Error('From asset not selected.')
  if (!toAsset) throw new Error('To asset not selected.')
  if (!fromAddress) throw new Error('Missing from address')
  if (!toAddress) throw new Error('Missing to address')
  if (fromAmount.planck === 0n) throw new Error('Cannot swap 0 amount')

  // map assets to chainflip assets
  const chainflipFromAsset = swappableAssetToChainflipAsset(fromAsset, assets)
  const chainflipToAsset = swappableAssetToChainflipAsset(toAsset, assets)
  const chainflipFromChain = chains.find(c => c.chain === CHAINFLIP_ID_TO_CHAIN_MAP[fromAsset.chainId.toString()])
  if (!chainflipFromAsset) throw new Error(`${fromAsset.symbol} on ${fromAsset.chainId} not supported on Chainflip`)
  if (!chainflipToAsset) throw new Error(`${toAsset.symbol} on ${toAsset.chainId} not supported on Chainflip`)
  if (!chainflipFromChain) throw new Error(`Chain ${fromAsset.chainId} not supported on Chainflip`)

  // validate from address for the source chain
  if (!validateAddress(fromAddress, fromAsset.networkType))
    throw new Error(`Cannot swap from ${fromAsset.chainId} chain with address: ${fromAddress}`)

  // validate to address for the target chain
  if (!validateAddress(toAddress, toAsset.networkType))
    throw new Error(`Cannot swap to ${toAsset.chainId} chain with address: ${toAddress}`)

  // cannot swap from BTC
  if (fromAsset.networkType === 'btc') throw new Error('Swapping from BTC is not supported.')

  const gotQuote = get(quote)
  if (gotQuote.state !== 'hasData') throw new Error('Invalid chainflip quote')
  if (Array.isArray(gotQuote.data)) throw new Error('Invalid chainflip quote')

  const cfQuote = gotQuote.data?.data

  const substrateChains = await get(chainsAtom)
  const fromSubstrateChain = substrateChains.find(c => c.id === fromAsset.chainId)
  const toSubstrateChain = substrateChains.find(c => c.id === toAsset.chainId)
  const srcAddress = fromSubstrateChain ? encodeAnyAddress(fromAddress, fromSubstrateChain?.prefix ?? 42) : fromAddress
  const destAddress = toSubstrateChain ? encodeAnyAddress(toAddress, toSubstrateChain?.prefix ?? 42) : toAddress

  try {
    // request a deposit address to send funds to
    const depositAddress = await sdk.requestDepositAddressV2({
      srcAddress,
      destAddress,
      quote: cfQuote,
      brokerCommissionBps,
      fillOrKillParams: {
        refundAddress: srcAddress,
        slippageTolerancePercent: 4, // 4% slippage
        retryDurationBlocks: 100, // 100 blocks * 6 seconds = 10 minutes before deposits are refunded
      },
    })

    // begin swap
    if (fromAsset.networkType === 'evm') {
      if (!evmWalletClient) throw new Error('Ethereum account not connected')
      const chain = EVM_CHAINS.find(c => c.id.toString() === fromAsset.chainId.toString())
      if (!chain) throw new Error('Chain not found')

      await evmWalletClient.switchChain({ id: chain.id })
      let hash: `0x${string}`
      if (!chainflipFromAsset.contractAddress) {
        hash = await evmWalletClient.sendTransaction({
          chain,
          to: depositAddress.depositAddress as `0x${string}`,
          value: BigInt(depositAddress.amount),
          account: fromAddress as `0x${string}`,
        })
      } else {
        hash = await evmWalletClient.writeContract({
          chain,
          abi: erc20Abi,
          address: fromAsset.contractAddress as `0x${string}`,
          functionName: 'transfer',
          account: fromAddress as `0x${string}`,
          args: [depositAddress.depositAddress as `0x${string}`, BigInt(depositAddress.amount)],
        })
      }

      saveAddressForQuest(depositAddress.depositChannelId, fromAddress, PROTOCOL)
      return {
        protocol: PROTOCOL,
        depositRes: {
          chainId: chain.id,
          extrinsicId: hash,
        },
        data: {
          id: depositAddress.depositChannelId,
          network,
          depositResult: {
            chainId: chain.id,
            hash,
            type: 'evm',
          },
        },
      }
    } else if (fromAsset.networkType === 'substrate') {
      const signer = substrateWallet?.signer
      if (!signer) throw new Error('Substrate wallet not connected.')
      const chains = await get(chainsAtom)
      const substrateChain = chains.find(c => c.id === fromAsset.chainId)
      const rpc = substrateChain?.rpcs?.[0]?.url
      if (!rpc) throw new Error('RPC not found!')
      const polkadotApi = await getSubstrateApi(rpc)
      const transferRes = await substrateNativeSwapTransfer(
        polkadotApi,
        allowReap,
        depositAddress.depositAddress,
        fromAddress,
        depositAddress.amount,
        signer
      )

      if (transferRes.ok) saveAddressForQuest(depositAddress.depositChannelId, fromAddress, PROTOCOL)
      return {
        protocol: PROTOCOL,
        depositRes: {
          chainId: substrateChain.id,
          extrinsicId: transferRes.id,
          error: transferRes.error,
        },
        data: {
          id: depositAddress.depositChannelId,
          network,
          depositResult: {
            extrinsicId: transferRes.id,
            chainId: substrateChain.id,
            type: 'substrate',
          },
        },
      }
    } else {
      // should never reach here
      throw new Error('Source asset not supported.')
    }
  } catch (e) {
    console.error(e)
    // TODO: convert to user friendly error messages
    throw e
  }
}

const estimateGas: GetEstimateGasTxFunction = async (get, { getSubstrateApi }) => {
  const fromAsset = get(fromAssetAtom)
  const fromAddress = get(fromAddressAtom)
  if (!fromAsset) return null
  if (!fromAddress) return null

  const swappingFromEVM = EVM_CHAINS.some(c => c.id.toString() === fromAsset.chainId.toString())
  if (swappingFromEVM) {
    if (!isAddress(fromAddress)) return null // invalid ethereum address
    const knownEvmNetworks = await get(knownEvmNetworksAtom)
    const network = knownEvmNetworks[fromAsset.chainId]
    const evmChain = EVM_CHAINS.find(c => c.id.toString() === fromAsset.chainId.toString())

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

  const transfer = polkadotApi.tx.balances['transferAllowDeath'] ?? polkadotApi.tx.balances['transfer']
  const transferTx = transfer(fromAddress, fromAmount.planck)
  const decimals = transferTx.registry.chainDecimals[0] ?? 10 // default to polkadot decimals 10
  const paymentInfo = await transferTx.paymentInfo(fromAddress)
  return {
    name: 'Est. Gas Fees',
    tokenId: substrateChain?.nativeToken?.id ?? 'polkadot-substrate-native',
    amount: BigNumber(paymentInfo.partialFee.toBigInt().toString()).times(10 ** -decimals),
  }
}

export const chainflipSwapModule: SwapModule = {
  protocol: PROTOCOL,
  fromAssetsSelector,
  toAssetsSelector,
  quote,
  swap,
  decentralisationScore: DECENTRALISATION_SCORE,
}

// helpers

const retryStatus = async (
  get: Getter,
  id: string,
  attempts = 0
): Promise<SwapStatusResponseV2 & { expired: boolean }> => {
  try {
    const status = await get(swapSdkAtom).getStatusV2({ id })
    let expired = false

    if (!['FAILED', 'COMPLETE', 'BROADCAST_ABORTED'].includes(status.state)) {
      if (status.depositChannel?.estimatedExpiryTime && status.state === 'WAITING') {
        const now = new Date().getTime()
        expired = now > status.depositChannel.estimatedExpiryTime
      }
      if (!expired) get(swapQuoteRefresherAtom)
    }

    return { ...status, expired }
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

export const chainflipSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
