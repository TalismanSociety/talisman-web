import { knownEvmNetworksAtom } from '../helpers'
import {
  BaseQuote,
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  QuoteFunction,
  SwapFunction,
  SwapModule,
  SwappableAssetBaseType,
  swapQuoteRefresherAtom,
  toAddressAtom,
  toAssetAtom,
} from './common.swap-module'
import * as sdk from '@lifi/sdk'
import { evmErc20TokenId, evmNativeTokenId } from '@talismn/balances'
import { evmNetworksByIdAtom } from '@talismn/balances-react'
import { Decimal } from '@talismn/math'
import { atom, Getter, Setter } from 'jotai'
import { loadable } from 'jotai/utils'
import { createPublicClient, http, zeroAddress } from 'viem'
import * as allEvmChains from 'viem/chains'

const PROTOCOL = 'lifi' as const
const DECENTRALISATION_SCORE = 2

sdk.createConfig({
  integrator: 'talisman',
  apiKey: import.meta.env.REACT_APP_LIFI_SECRET,
})

export const fromAssetsSelector = atom(async (get): Promise<SwappableAssetBaseType[]> => {
  const res = await sdk.getTokens()
  const networks = await get(evmNetworksByIdAtom)
  const tokens = Object.entries(res.tokens)
    .filter(([id]) => {
      return networks[id.toString()]
    })
    .map(([id, tokens]): SwappableAssetBaseType[] => {
      return tokens.map(t => {
        return {
          chainId: id,
          context: {
            lifi: t,
          },
          decimals: t.decimals,
          name: t.name,
          networkType: 'evm',
          symbol: t.symbol,
          contractAddress: t.address === zeroAddress ? undefined : t.address,
          image: t.logoURI,
          id: t.address === zeroAddress ? evmNativeTokenId(id) : evmErc20TokenId(id, t.address),
        }
      })
    })
  return tokens.flat()
})

const quoteAtom: QuoteFunction<sdk.LiFiStep> = loadable(
  atom(
    async (
      get
    ): Promise<
      | (BaseQuote & {
          data?: sdk.LiFiStep
        })
      | null
    > => {
      const fromAddress = get(fromAddressAtom) ?? '0x70045A9F59A354550EC0272f73AAe03B01Fb8a7a'
      const toAddress = get(toAddressAtom) ?? '0x70045A9F59A354550EC0272f73AAe03B01Fb8a7a'
      const fromAsset = get(fromAssetAtom)
      const toAsset = get(toAssetAtom)
      const fromAmount = get(fromAmountAtom)
      const networks = await get(knownEvmNetworksAtom)

      // assets not supported
      if (fromAsset?.networkType !== 'evm' || toAsset?.networkType !== 'evm') return null
      const evmNetwork = networks[fromAsset.chainId.toString()]
      // network not supported
      if (!evmNetwork) return null

      // force refresh
      get(swapQuoteRefresherAtom)

      const quote = await sdk.getQuote({
        fromAddress,
        toAddress,
        fromChain: fromAsset.chainId.toString(),
        toChain: toAsset.chainId.toString(),
        fromAmount: fromAmount.planck.toString(),
        fromToken: fromAsset.contractAddress ?? fromAsset.symbol,
        toToken: toAsset.contractAddress ?? toAsset.symbol,
      })

      if (!quote.transactionRequest) return null

      const fees =
        quote.estimate.feeCosts?.map(fee => ({
          amount: Decimal.fromPlanck(BigInt(fee.amount), fee.token.decimals),
          name: fee.name,
          tokenId:
            fee.token.address === zeroAddress
              ? evmNativeTokenId(fee.token.chainId.toString())
              : evmErc20TokenId(fee.token.chainId.toString(), fee.token.address),
        })) ?? []

      try {
        const client = createPublicClient({
          transport: http(evmNetwork.rpcs[0]),
        })

        const gasPrice = await client.getGasPrice()
        const gas = await client.estimateGas({
          data: quote.transactionRequest.data as `0x${string}`,
          value: BigInt(quote.transactionRequest.value as `0x${string}`),
          to: quote.transactionRequest.to as `0x${string}`,
          account: fromAddress as `0x${string}`,
        })

        fees.push({
          amount: Decimal.fromPlanck(gasPrice * gas, evmNetwork.nativeToken.decimals),
          name: 'Gas',
          tokenId: evmNativeTokenId(fromAsset.chainId.toString()),
        })
      } catch (e) {
        // failed to estimate gas, swap may fail due to insufficient balance
        // but we still show the swap in case users just want to check the rate
      }

      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        fees:
          quote.estimate.feeCosts?.map(fee => ({
            amount: Decimal.fromPlanck(BigInt(fee.amount), fee.token.decimals),
            name: fee.name,
            tokenId:
              fee.token.address === zeroAddress
                ? evmNativeTokenId(fee.token.chainId.toString())
                : evmErc20TokenId(fee.token.chainId.toString(), fee.token.address),
          })) ?? [],
        inputAmountBN: fromAmount.planck,
        outputAmountBN: BigInt(quote.estimate.toAmountMin),
        protocol: PROTOCOL,
        timeInSec: quote.estimate.executionDuration,
        data: quote,
      }
    }
  )
)

// if approval is required, returns the contract to approve for, the amount, and token contract
const approvalAtom = atom(get => {
  const quote = get(quoteAtom)
  const fromAsset = get(fromAssetAtom)
  if (quote.state !== 'hasData' || !quote.data || !fromAsset || !fromAsset.contractAddress) return null

  const lifiData = quote.data.data as sdk.LiFiStep
  if (!lifiData.transactionRequest) return null
  const contractAddress = lifiData.transactionRequest.to
  const chainId = lifiData.transactionRequest.chainId
  const fromAddress = lifiData.transactionRequest.from
  if (!contractAddress || chainId === undefined || !fromAddress) return null

  const amount = BigInt(lifiData.estimate.fromAmount)

  return {
    contractAddress,
    amount,
    tokenAddress: fromAsset.contractAddress,
    chainId,
    fromAddress,
    protocolName: 'LI.FI',
  }
})

const swap: SwapFunction<{ id: string }> = async (get: Getter, _: Setter, { evmWalletClient }) => {
  const quote = get(quoteAtom)

  if (quote.state !== 'hasData' || !quote.data) throw new Error('Swap not ready yet.')

  const networks = await get(knownEvmNetworksAtom)
  const fromAsset = get(fromAssetAtom)

  if (!evmWalletClient) throw new Error('Ethereum wallet not connected.')
  if (fromAsset?.networkType !== 'evm') throw new Error('Not supported on Lifi')

  const evmNetwork = networks[fromAsset.chainId.toString()]
  if (!evmNetwork) throw new Error('Network not supported')

  const lifiData = quote.data.data as sdk.LiFiStep
  const txRequest = lifiData.transactionRequest
  if (
    !txRequest ||
    txRequest.to === undefined ||
    txRequest.data === undefined ||
    txRequest.chainId === undefined ||
    txRequest.value === undefined ||
    txRequest.from === undefined ||
    txRequest.gasLimit === undefined
  )
    throw new Error('Unknown error, please try again.')

  if (txRequest.from.toLowerCase() !== evmWalletClient.account?.address.toLowerCase())
    throw new Error('Invalid sender address')

  const chain = Object.values(allEvmChains).find(c => c.id === txRequest.chainId)
  if (!chain) throw new Error('Unknown chain')

  await evmWalletClient.switchChain({ id: chain.id })
  const swapHash = await evmWalletClient.sendTransaction({
    to: txRequest.to as `0x${string}`,
    value: BigInt(txRequest.value),
    data: txRequest.data as `0x${string}`,
    gasLimit: txRequest.gasLimit,
    account: txRequest.from as `0x${string}`,
    chain,
  })

  console.log(swapHash)
  return {
    data: {
      id: lifiData.id,
    },
    protocol: PROTOCOL,
  }
}

export const lifiSwapModule: SwapModule = {
  protocol: PROTOCOL,
  fromAssetsSelector,
  toAssetsSelector: fromAssetsSelector,
  quote: quoteAtom,
  swap,
  decentralisationScore: DECENTRALISATION_SCORE,
  approvalAtom,
}
