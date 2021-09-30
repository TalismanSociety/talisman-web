import { useApi } from '@libs/talisman'
import { get } from 'lodash'
import { PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'

//
// Types
//

export type Chainmeta = {
  chain?: string
  nodeName?: string
  nodeVersion?: string
  tokenSymbol?: string
  tokenDecimals?: string
  blockPeriod?: number
  blockNumber?: number
  blockHash?: string
}

//
// Hooks (exported)
//

export const useChainmeta = () => useContext()

export const useChainmetaValue = (key: string) => get(useChainmeta().chainmeta, key)

//
// Context
//

type ContextProps = {
  chainmeta: Chainmeta | null
}

const Context = createContext<ContextProps | null>(null)

function useContext() {
  const context = _useContext(Context)
  if (!context) throw new Error('The talisman extension provider is required in order to use this hook')

  return context
}

//
// Provider
//

export const Provider = ({ children }: PropsWithChildren<{}>) => {
  const api = useApi()
  const [chainmeta, setChainmeta] = useState<Chainmeta | null>(null)

  useEffect(() => {
    if (!api?.isReady) return
    let cancelled = false
    let unsub: Function | null = null

    Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version(),
      api.rpc.system.properties(),
    ]).then(([chain, nodeName, nodeVersion, properties]) => {
      setChainmeta(chainmeta => ({
        ...chainmeta,
        chain: chain.toString(),
        nodeName: nodeName.toString(),
        nodeVersion: nodeVersion.toString(),
        tokenSymbol: properties.tokenSymbol.value[0].toString(),
        tokenDecimals: properties.tokenDecimals.value[0].toString(),
        blockPeriod: 6,
      }))
    })

    api.rpc.chain
      .subscribeNewHeads(header => {
        setChainmeta(chainmeta => ({
          ...chainmeta,
          blockNumber: header.number.toNumber(),
          blockHash: header.hash.toString(),
        }))
      })
      .then(_unsub => {
        if (cancelled) _unsub()
        else unsub = _unsub
      })

    return () => {
      cancelled = true
      unsub && unsub()
    }
  }, [api, api?.isReady])

  const value = useMemo(() => ({ chainmeta }), [chainmeta])

  return <Context.Provider value={value}>{children}</Context.Provider>
}
