import { knownEvmNetworksAtom } from '../helpers'
import {
  fromAddressAtom,
  fromAmountAtom,
  fromAssetAtom,
  QuoteFunction,
  selectedSubProtocolAtom,
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
import { atomFamily, loadable } from 'jotai/utils'
import { zeroAddress } from 'viem'
import * as allEvmChains from 'viem/chains'

const PROTOCOL = 'lifi' as const
const DECENTRALISATION_SCORE = 2
const TALISMAN_FEE = 0.002

sdk.createConfig({
  integrator: 'talisman',
  apiKey: import.meta.env.REACT_APP_LIFI_SECRET,
})

export const fromAssetsSelector = atom(async (get): Promise<SwappableAssetBaseType[]> => {
  const res = await sdk.getTokens({ chainTypes: [sdk.ChainType.EVM, sdk.ChainType.SVM] })
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

const routesAtom = atom(async get => {
  try {
    const SWAP_PLACEHOLDER_ADDRESS = '0x70045A9F59A354550EC0272f73AAe03B01Fb8a7a'
    const fromAddress = get(fromAddressAtom) ?? SWAP_PLACEHOLDER_ADDRESS
    const toAddress = get(toAddressAtom) ?? SWAP_PLACEHOLDER_ADDRESS
    const fromAsset = get(fromAssetAtom)
    const toAsset = get(toAssetAtom)
    const fromAmount = get(fromAmountAtom)
    const networks = await get(knownEvmNetworksAtom)

    if (fromAmount.planck === 0n) return null
    // assets not supported
    if (fromAsset?.networkType !== 'evm' || toAsset?.networkType !== 'evm') return null
    const evmNetwork = networks[fromAsset.chainId.toString()]
    // network not supported
    if (!evmNetwork) return null

    get(swapQuoteRefresherAtom)

    return await sdk.getRoutes({
      fromAddress,
      toAddress,
      fromChainId: +fromAsset.chainId,
      toChainId: +toAsset.chainId,
      fromAmount: fromAmount.planck.toString(),
      fromTokenAddress: fromAsset.contractAddress ?? zeroAddress,
      toTokenAddress: toAsset.contractAddress ?? zeroAddress,
      options: {
        integrator: 'talisman',
        fee: TALISMAN_FEE,
      },
    })
  } catch (e) {
    return { routes: [], unavailableRoutes: { failed: [], filteredOut: [] } } as sdk.RoutesResponse
  }
})
const subProviderQuoteAtom = atomFamily((id: string) =>
  loadable(
    atom(async get => {
      const routes = await get(routesAtom)
      if (!routes) return null
      const route = routes.routes.find(r => r.id === id)
      const step = route?.steps[0]
      if (!step) return null
      const transaction = await sdk.getStepTransaction(step)
      if (!transaction?.transactionRequest) return null

      const fees =
        step.estimate.feeCosts?.map(fee => ({
          amount: Decimal.fromPlanck(BigInt(fee.amount), fee.token.decimals),
          name: fee.name,
          tokenId:
            fee.token.address === zeroAddress
              ? evmNativeTokenId(fee.token.chainId.toString())
              : evmErc20TokenId(fee.token.chainId.toString(), fee.token.address),
        })) ?? []

      if (step.estimate.gasCosts) {
        step.estimate.gasCosts.forEach(c => {
          fees.push({
            amount: Decimal.fromPlanck(c.amount, c.token.decimals),
            name: 'Gas',
            tokenId:
              c.token.address === zeroAddress
                ? evmNativeTokenId(c.token.chainId.toString())
                : evmErc20TokenId(c.token.chainId.toString(), c.token.address),
          })
        })
      }
      return {
        decentralisationScore: DECENTRALISATION_SCORE,
        fees,
        talismanFeeBps: TALISMAN_FEE,
        inputAmountBN: BigInt(step.estimate.fromAmount),
        outputAmountBN: BigInt(route.toAmountMin),
        protocol: PROTOCOL,
        timeInSec: step.estimate.executionDuration,
        data: { ...route, transactionRequest: transaction.transactionRequest },
        providerLogo: step.toolDetails.logoURI,
        providerName: step.toolDetails.name,
        subProtocol: step.tool,
      }
    })
  )
)

const quoteAtom: QuoteFunction<sdk.Route & { transactionRequest: sdk.TransactionRequest }> = loadable(
  atom(async get => {
    const routes = await get(routesAtom)
    if (!routes) return null

    return routes.routes.map(r => get(subProviderQuoteAtom(r.id)))
  })
)

// if approval is required, returns the contract to approve for, the amount, and token contract
const approvalAtom = atom(get => {
  const quote = get(quoteAtom)
  const fromAsset = get(fromAssetAtom)
  if (quote.state !== 'hasData' || !quote.data || !fromAsset || !fromAsset.contractAddress) return null

  const selectedSubProtocol = get(selectedSubProtocolAtom)
  const quoteData = Array.isArray(quote.data)
    ? quote.data.map(d => (d.state === 'hasData' ? d.data : null)).find(d => d?.subProtocol === selectedSubProtocol)
    : quote.data
  const lifiData = quoteData?.data
  if (!lifiData?.transactionRequest) return null
  const contractAddress = lifiData.transactionRequest.to
  const chainId = lifiData.transactionRequest.chainId
  const fromAddress = lifiData.transactionRequest.from
  if (!contractAddress || chainId === undefined || !fromAddress) return null

  const amount = BigInt(lifiData.fromAmount)

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
  const selectedSubProtocol = get(selectedSubProtocolAtom)

  if (quote.state !== 'hasData' || !quote.data) throw new Error('Swap not ready yet.')

  const networks = await get(knownEvmNetworksAtom)
  const fromAsset = get(fromAssetAtom)

  if (!evmWalletClient) throw new Error('Ethereum wallet not connected.')
  if (fromAsset?.networkType !== 'evm') throw new Error('Not supported on Lifi')

  const evmNetwork = networks[fromAsset.chainId.toString()]
  if (!evmNetwork) throw new Error('Network not supported')

  const quoteData = Array.isArray(quote.data)
    ? quote.data.map(d => (d.state === 'hasData' ? d.data : null)).find(d => d?.subProtocol === selectedSubProtocol)
    : quote.data
  const lifiData = quoteData?.data
  if (!lifiData?.transactionRequest) throw new Error('Please select the quote again.')
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

  return {
    data: {
      id: swapHash,
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

const retryStatus = async (
  get: Getter,
  id: string,
  attempts = 0
): Promise<{ status: sdk.StatusResponse; expired?: boolean }> => {
  try {
    const status = await sdk.getStatus({ txHash: id })
    const expired = false

    if (status.substatus !== 'COMPLETED') {
      get(swapQuoteRefresherAtom)
    }

    return { status, expired }
  } catch (e) {
    const error = e as Error & { response?: { status: number } }
    // because we're using a broker, the tx isnt always available immediately in their api service
    // so we wait a bit and retry
    if (error.name === 'AxiosError' && error?.response?.status === 404 && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      get(swapQuoteRefresherAtom)
    }
    throw e
  }
}

export const lifiSwapStatusAtom = atomFamily((id: string) => atom(async get => await retryStatus(get, id)))
