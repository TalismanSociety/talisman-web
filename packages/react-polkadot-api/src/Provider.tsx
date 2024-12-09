import type { PropsWithChildren } from 'react'
import { useContext } from 'react'
import { RecoilRoot } from 'recoil'

import type { DeriveState, QueryState } from './query'
import type { QueryMultiState } from './queryMulti'
import type { ApiId } from './types'
import { ApiIdContext, RecoilStateContext } from './Context'
import { POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE } from './GarbageCollector'

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
