import { useReducer } from 'react'
import { get } from 'lodash'
import { PropsWithChildren, useContext as _useContext, createContext, useEffect, useMemo, useState } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api';
import { SupportedParachains } from './util/_config'

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
  const chains = useChainmeta(null)
  const [val, setVal] = useState(null)

  useEffect(() => {
    if(!chains[chainId]) return
    setVal(get(chains[chainId], key)||null)
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

const ParachainReducer = (state={}, data) => {
  
  // not exists
  if(!state[data.id]){
    state[data.id] = data
  }
  // exists
  else{
    state[data.id] = {
      ...state[data.id],
      ...data
    }
  }

  return {...state}
}

export const Provider = ({ children }: PropsWithChildren<{}>) => {

  const [ chains, dispatch ] = useReducer(ParachainReducer, {})


  const hydrateChainMeta = (id: number, rpc: string) => {
    const wsProvider = new WsProvider(rpc);
    ApiPromise
      .create({ provider: wsProvider })
      .then(api => {

        // fetch the static values
        Promise.all([
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.version(),
          api.rpc.system.properties(),
        ]).then(([chain, nodeName, nodeVersion, properties]) => {
          dispatch({
            id,
            chain: chain.toString(),
            nodeName: nodeName.toString(),
            nodeVersion: nodeVersion.toString(),
            tokenSymbol: properties.tokenSymbol.value[0].toString(),
            tokenDecimals: properties.tokenDecimals.value[0].toString(),
            blockPeriod: 6,
          })
        })

        // subscribe to dynamic values
        api.rpc.chain
          .subscribeNewHeads(header => {
            dispatch({
              id,
              blockNumber: header.number.toNumber(),
              blockHash: header.hash.toString(),
            })
          })
        
      })
      .catch(error => console.log('ERROR', error.message))
  }

  useEffect(() => {
    Object.values(SupportedParachains).forEach(chain => {
      hydrateChainMeta(chain.id, chain.rpc)
    })
  }, [])

  return <Context.Provider value={chains}>{children}</Context.Provider>
}
