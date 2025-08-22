import type { Chain as ViemChain } from 'viem/chains'
import { chaindataProviderAtom, chainsAtom, coinsApiConfigAtom, evmNetworksAtom } from '@talismn/balances-react'
import { TokenList } from '@talismn/chaindata-provider'
import { isEthereumAddress } from '@talismn/crypto'
import { ALL_CURRENCY_IDS, fetchTokenRates, TokenRatesList } from '@talismn/token-rates'
import { isTruthy } from '@talismn/util'
import { atom, useSetAtom } from 'jotai'
import { atomEffect } from 'jotai-effect'
import { atomFamily, atomWithObservable, loadable } from 'jotai/utils'
import { useEffect } from 'react'
import { createPublicClient, fallback, http } from 'viem'

import { allEvmChains } from '@/components/widgets/swap/allEvmChains.ts'
import { substrateApiGetterAtom } from '@/domains/common/recoils/api'
import { computeSubstrateBalance } from '@/util/balances'
import { Decimal } from '@/util/Decimal'
import { getMultibalance } from '@/util/multibalance'

import {
  fromEvmAddressAtom,
  fromSubstrateAddressAtom,
  SwappableAssetWithDecimals,
} from './swap-modules/common.swap-module'
import { fromAssetsAtom } from './swaps.api'

const fromAssetsByChainIdAtom = atom(async get => {
  const fromEvmAddress = get(fromEvmAddressAtom)
  const fromSubstrateAddress = get(fromSubstrateAddressAtom)

  if (!fromEvmAddress && !fromSubstrateAddress) return { evmAssetsByChainId: {}, substrateAssetsByChainId: {} }

  const fromAssets = await get(fromAssetsAtom)

  const evmAssetsByChainId: Record<string, SwappableAssetWithDecimals[]> = {}
  const substrateAssetsByChainId: Record<string, SwappableAssetWithDecimals[]> = {}

  fromAssets.forEach(asset => {
    if (asset.networkType === 'evm') {
      const assets = evmAssetsByChainId[asset.chainId] || []
      assets.push(asset)
      evmAssetsByChainId[asset.chainId] = assets
    } else {
      const assets = substrateAssetsByChainId[asset.chainId] || []
      assets.push(asset)
      substrateAssetsByChainId[asset.chainId] = assets
    }
  })
  return { evmAssetsByChainId, substrateAssetsByChainId }
})

const evmBalancesAtom = atomFamily((chainId: string) =>
  atom(async get => {
    try {
      const assetsByChainId = await get(fromAssetsByChainIdAtom)
      const assets = assetsByChainId.evmAssetsByChainId[chainId]
      const fromEvmAddress = get(fromEvmAddressAtom)
      if (!assets || !fromEvmAddress) return { balances: {} }

      const evmNetworks = await get(evmNetworksAtom)
      const network = evmNetworks.find(network => network.id.toString() === chainId.toString())
      const rpcs = network?.rpcs
      const chain: ViemChain | undefined = Object.values(allEvmChains).find(chain => chain?.id.toString() === chainId)
      if (!chain || !rpcs?.length) return { balances: {} }

      // make multicall request here
      const client = createPublicClient({
        transport: fallback(
          rpcs.map(rpc => http(rpc.url, { retryCount: 0 })),
          { retryCount: 0 }
        ),
        chain,
        batch: { multicall: true },
      })

      const balances: Record<string, Decimal> = {}

      // get native token balance if native token is supported for swapping
      const nativeToken = assets.find(a => !a.contractAddress)
      if (nativeToken) {
        const balance = await client.getBalance({ address: fromEvmAddress })
        balances[nativeToken.id] = Decimal.fromPlanck(balance, nativeToken.decimals, { currency: nativeToken.symbol })
      }

      // get all erc20 tokens balances
      const erc20Tokens = assets.filter(asset => asset.contractAddress)
      if (erc20Tokens.length > 0) {
        const multibalances = await getMultibalance(
          client,
          Number(chainId),
          erc20Tokens.map(({ contractAddress }) => ({ owner: fromEvmAddress, token: contractAddress! }))
        )

        multibalances.forEach((balanceBN, index) => {
          const token = erc20Tokens[index]
          if (!token) return
          const balance = Decimal.fromPlanck(balanceBN, token.decimals, { currency: token.symbol })
          balances[token.id] = balance
        })
      }
      return { balances }
    } catch (e) {
      return { balances: {} }
    }
  })
)

const ownedAddressesAtom = atom<string[] | null>(null)
export const useSetOwnedAddresses = (addresses: string[]) => {
  const setAddresses = useSetAtom(ownedAddressesAtom)
  useEffect(() => void setAddresses(addresses), [addresses, setAddresses])
}

export const substrateBalancesAtom = atomFamily((chainId: string) =>
  atom(async get => {
    try {
      const assetsByChainId = await get(fromAssetsByChainIdAtom)
      const assets = assetsByChainId.substrateAssetsByChainId[chainId]
      const ownedSubstrateAddresses = get(ownedAddressesAtom)?.filter(addresses => !isEthereumAddress(addresses))
      const substrateApiGetter = get(substrateApiGetterAtom)

      if (!assets) return { balances: {} }
      if (!ownedSubstrateAddresses) return { balances: {} }
      if (!ownedSubstrateAddresses.length) return { balances: {} }

      const queryAddresses = ownedSubstrateAddresses

      const chains = await get(chainsAtom)
      const chain = chains.find(chain => chain.id.toString() === chainId.toString())
      const chainRpc = chain?.rpcs?.[0]
      if (!chain || !chainRpc) return { balances: {} }

      const api = await substrateApiGetter?.getApi(chainRpc.url)
      if (!api) return { balances: {} }

      const balances: Record<string, Decimal> = {}
      const nativeToken = assets.find(a => a.id === chain.nativeToken?.id)
      if (nativeToken) {
        const accounts = await api?.query.system.account.multi(queryAddresses)
        const accountBalances = accounts.map(account => computeSubstrateBalance(api, account))
        balances[nativeToken.id] = Decimal.fromPlanck(
          accountBalances.reduce((acc, b) => acc + b.transferrable.planck, 0n),
          nativeToken.decimals,
          { currency: nativeToken.symbol }
        )
      }

      const assetHubAssets = assets.filter(a => a.assetHubAssetId !== undefined)
      if (assetHubAssets.length > 0 && api.query.assets) {
        const accounts = await api.query.assets.account.multi(
          queryAddresses.flatMap(address => assetHubAssets.map(asset => [asset.assetHubAssetId!, address]))
        )
        accounts.forEach((acc, index) => {
          const balanceBN = acc.value?.balance?.toBigInt() ?? 0n
          const token = assetHubAssets[index]
          if (!token) return
          const balance = Decimal.fromPlanck(balanceBN, token.decimals, { currency: token.symbol })
          balances[token.id] = balance
        })
      }
      // make substrate request here
      return { balances }
    } catch (e) {
      return { balances: {} }
    }
  })
)

export const fromAssetsBalancesAtom = atom(async get => {
  const fromAssets = await get(fromAssetsByChainIdAtom)

  const balanceLoadables = [
    ...Object.keys(fromAssets.evmAssetsByChainId).map(chainId => get(loadable(evmBalancesAtom(chainId)))),
    ...Object.keys(fromAssets.substrateAssetsByChainId).map(chainId => get(loadable(substrateBalancesAtom(chainId)))),
  ]
  const balances = balanceLoadables.filter(b => b.state === 'hasData').map(b => b.data.balances)

  return balances.reduce((acc, balances) => ({ ...acc, ...balances }), {} as Record<string, Decimal>)
})

const allTokensByIdAtom = atomWithObservable(get => get(chaindataProviderAtom).tokensByIdObservable)

const _swapTokenRatesAtom = atom<TokenRatesList>({})
export const swapTokenRatesAtom = atom(async get => {
  // keep token rates up to date
  get(fetchSwapTokenRatesEffect)
  return get(_swapTokenRatesAtom)
})

const fetchSwapTokenRatesEffect = atomEffect((get, set) => {
  // lets us tear down the existing timer when the effect is restarted
  const abort = new AbortController()

  // we have to get these synchronously so that jotai knows to restart our timer when they change
  const coinsApiConfig = get(coinsApiConfigAtom)
  const assetsPromise = get(fromAssetsAtom)
  const allTokensByIdPromise = get(allTokensByIdAtom)

  ;(async () => {
    const assets = await assetsPromise
    const allTokensById = await allTokensByIdPromise
    const swapTokensById: TokenList = {}
    for (const asset of assets) {
      const assetToken = allTokensById[asset.id]
      if (assetToken) swapTokensById[asset.id] = assetToken
    }

    const loopMs = 300_000 // 300_000ms = 300s = 5 minutes
    const retryTimeout = 5_000 // 5_000ms = 5 seconds

    const hydrate = async () => {
      try {
        if (abort.signal.aborted) return // don't fetch if aborted
        const swapRates = await fetchTokenRates(swapTokensById, ALL_CURRENCY_IDS, coinsApiConfig)

        if (abort.signal.aborted) return // don't update atom if aborted
        set(_swapTokenRatesAtom, swapRates)

        if (abort.signal.aborted) return // don't schedule next loop if aborted
        setTimeout(hydrate, loopMs)
      } catch (error) {
        const retrying = !abort.signal.aborted
        const messageParts = [
          'Failed to fetch tokenRates',
          retrying && `retrying in ${Math.round(retryTimeout / 1000)} seconds`,
          !retrying && `giving up (timer no longer needed)`,
        ].filter(isTruthy)
        console.error(messageParts.join(', '), error)

        const isAbortError = (error: unknown): boolean => error instanceof Error && error.name === 'AbortError'
        if (isAbortError(error)) return // don't schedule retry if aborted
        setTimeout(hydrate, retryTimeout)
      }
    }

    // launch the loop
    hydrate()
  })()

  return () => abort.abort('Unsubscribed')
})
