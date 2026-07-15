import { ApiPromise, WsProvider } from '@polkadot/api'

const cache = new Map<string, Promise<ApiPromise>>()

/**
 * Get (and memoize) an `ApiPromise` for a raw websocket endpoint, bypassing the chaindata-driven
 * ChainConnector used by `apiPromiseAtom`.
 *
 * This exists so we can connect to a chain via an explicit RPC override when its chaindata RPCs are
 * stale/unreachable (see `rpcOverrides` in domains/chains/config.ts). Connections are shared per
 * endpoint for the lifetime of the app.
 */
export const getApiPromiseByEndpoint = (endpoint: string): Promise<ApiPromise> => {
  const existing = cache.get(endpoint)
  if (existing) return existing

  const promise = ApiPromise.create({ provider: new WsProvider(endpoint), noInitWarn: true })
  cache.set(endpoint, promise)
  return promise
}
