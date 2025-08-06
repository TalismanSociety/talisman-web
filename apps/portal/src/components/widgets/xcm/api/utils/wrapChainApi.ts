import { AnyChain, ChainRoutes, Parachain } from '@galacticcouncil/xcm-core'
import { dotNetworksByGenesisHashAtom } from '@talismn/balances-react'

import { apiPromiseAtom } from '@/domains/common/atoms/apiPromiseAtom'
import { jotaiStore } from '@/util/jotaiStore'

/**
 * This function wraps the `chain.api` method from `@galacticcouncil/xcm-cfg` so that the chain connections
 * made via the `@galacticcouncil/xcm-sdk` library can share the one WsProvider with the balances library.
 *
 * Without this, two connections would need to be made to each chain rpc: one for the balances library, one for the XCM SDK.
 */
export function overrideChainApis(chains: Map<string, AnyChain>): Map<string, AnyChain> {
  return new Map(chains.entries().map(([key, chain]) => [key, wrapChainApi(chain)]))
}

/**
 * This function wraps the `chain.api` method from `@galacticcouncil/xcm-cfg` so that the chain connections
 * made via the `@galacticcouncil/xcm-sdk` library can share the one WsProvider with the balances library.
 *
 * Without this, two connections would need to be made to each chain rpc: one for the balances library, one for the XCM SDK.
 */
export function overrideRoutesChainApis(routes: Map<string, ChainRoutes>): Map<string, ChainRoutes> {
  return new Map(
    routes.entries().map(([key, route]) => {
      return [
        key,
        // we need to use a Proxy, because `route.chain` is a getter (i.e. we can't assign to it directly)
        new Proxy(route, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          get(target: any, prop) {
            if (prop !== 'chain') return target[prop]
            return wrapChainApi(target.chain)
          },
        }),
      ]
    })
  )
}

/**
 * Returns the `chain` given to it, but with an override for the `chain.api` getter.
 *
 * The new `chain.api` getter will proxy all websocket requests through to the Talisman Wallet.
 * Also, the connection will be shared with any other Talisman Portal atoms/hooks which use `apiPromiseAtom`.
 */
function wrapChainApi(chain: AnyChain): AnyChain {
  if (!(chain instanceof Parachain)) return chain

  const chainProxy = new Proxy(chain, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(target: any, prop) {
      if (prop !== 'api') return target[prop]

      const getApi = async () => {
        const chaindataChainsByGenesisHash = await jotaiStore.get(dotNetworksByGenesisHashAtom)
        const chaindataChain = chaindataChainsByGenesisHash?.[chain.genesisHash]
        if (!chaindataChain) {
          console.warn(
            `Unable to proxy ${chain.key} connection through Talisman Wallet shared interface [NO CHAINDATA CHAIN]`
          )
          return chain.api
        }

        const api = await jotaiStore.get(apiPromiseAtom(chaindataChain.id))
        if (!api) {
          console.warn(`Unable to proxy ${chain.key} connection through Talisman Wallet shared interface [NO API]`)
          return chain.api
        }

        // we need to await api.isReady here, because the xcm-sdk library expects us to have done so before
        // we return the ApiPromise to it
        await api.isReady

        return api
      }

      // NOTE: Make sure to call getApi() here,
      // i.e. don't return the function - return the Promise which is returned by the function
      return getApi()
    },
  })

  return chainProxy
}
