import { createContext, useContext, type PropsWithChildren } from 'react'
import { POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE } from './GarbageCollector.js'
import type { DeriveState, QueryState } from './query.js'
import type { QueryMultiState } from './queryMulti.js'
import type { ApiId } from './types.js'
import { RecoilRoot } from 'recoil'

export const ApiIdContext = createContext<ApiId>(undefined)

export const RecoilStateContext = createContext<{
  queryState: QueryState
  deriveState: DeriveState
  queryMultiState: QueryMultiState
}>({
  // @ts-expect-error
  queryState: () => {
    throw new Error('Missing context provider')
  },
  // @ts-expect-error
  deriveState: () => {
    throw new Error('Missing context provider')
  },
  // @ts-expect-error
  queryMultiState: () => {
    throw new Error('Missing context provider')
  },
})

type PolkadotApiProviderProps = PropsWithChildren<{
  apiId?: ApiId
  queryState: QueryState
  deriveState: DeriveState
  queryMultiState: QueryMultiState
}>

export const PolkadotApiProvider = (props: PolkadotApiProviderProps) => (
  <RecoilRoot override={false}>
    <ApiIdContext.Provider value={props.apiId}>
      <RecoilStateContext.Provider
        value={{ queryState: props.queryState, deriveState: props.deriveState, queryMultiState: props.queryMultiState }}
      >
        <POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE />
        {props.children}
      </RecoilStateContext.Provider>
    </ApiIdContext.Provider>
  </RecoilRoot>
)

type PolkadotApiIdProviderProps = PropsWithChildren<{
  id: ApiId
}>

export const PolkadotApiIdProvider = (props: PolkadotApiIdProviderProps) => (
  <ApiIdContext.Provider value={props.id}>{props.children}</ApiIdContext.Provider>
)

export const usePolkadotApiId = () => useContext(ApiIdContext)
