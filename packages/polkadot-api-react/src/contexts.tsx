import React from 'react'
import { createContext, type PropsWithChildren } from 'react'
import { RecoilState } from 'recoil'
import { POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE } from './GarbageCollector.jsx'

type ChainStorageStateContext = (param: [string, string, string, string, any[]]) => RecoilState<unknown>

type ChainQueryMultiStateContext = (param: { endpoint: string; queries: any[] }) => RecoilState<unknown>

export const ChainStorageStateContext = createContext<ChainStorageStateContext>(() => {
  throw new Error('No chainState provided')
})

export const ChainQueryMultiStateContext = createContext<ChainQueryMultiStateContext>(() => {
  throw new Error('No chainQueryMultiState provided')
})

export const EndpointContext = createContext('')

export type PolkadotApiProviderProps = PropsWithChildren<{
  value: {
    chainStorageState: ChainStorageStateContext
    chainQueryMultiState: ChainQueryMultiStateContext
  }
}>

export const PolkadotApiRecoilProvider = (props: PolkadotApiProviderProps) => (
  <>
    <POLKADOT_API_STATE_GARBAGE_COLLECTOR_UNSTABLE />
    <ChainStorageStateContext.Provider value={props.value.chainStorageState}>
      <ChainQueryMultiStateContext.Provider value={props.value.chainQueryMultiState}>
        {props.children}
      </ChainQueryMultiStateContext.Provider>
    </ChainStorageStateContext.Provider>
  </>
)
