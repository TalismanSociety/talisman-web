import { WsProvider } from '@polkadot/api'
import { get } from 'lodash'
import {
  useReducer,
  type PropsWithChildren,
  useContext as _useContext,
  createContext,
  useEffect,
  useState,
} from 'react'

import { SupportedRelaychains } from './util/_config'

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

export const useChainmetaValue = (chainId: number, key: string) => {
  const chains = useChainmeta()
  const [val, setVal] = useState(null)

  useEffect(() => {
    if (!chains[chainId as any as keyof ContextProps]) return
    setVal(get(chains[chainId as any as keyof ContextProps], key) || null)
  }, [chainId, key, chains])

  return val
}

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

const ParachainReducer = (state: any = {}, data: any) => {
  // not exists
  if (!state[data.id]) {
    state[data.id] = data
  }
  // exists
  else {
    state[data.id] = {
      ...state[data.id],
      ...data,
    }
  }

  return { ...state }
}

export const Provider = ({ children }: PropsWithChildren) => {
  const [chains, dispatch] = useReducer(ParachainReducer, {})

  const hydrateBlock = async (chain: any) => {
    const wsProvider = new WsProvider(chain.rpc)

    wsProvider.on('connected', () => {
      const cb = (_error: Error | null, result: any) => {
        dispatch({
          id: chain?.id,
          blockNumber: result.number,
          blockHash: result.parentHash,
        })
      }

      void wsProvider.subscribe('chain_newHead', 'chain_subscribeNewHeads', [], cb)
    })
  }

  useEffect(() => {
    Object.values(SupportedRelaychains).forEach(chain => {
      dispatch(chain)
      void hydrateBlock(chain)
    })
  }, [])

  return <Context.Provider value={chains}>{children}</Context.Provider>
}
