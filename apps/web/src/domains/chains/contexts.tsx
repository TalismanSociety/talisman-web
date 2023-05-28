import { type PropsWithChildren, createContext } from 'react'
import { type Chain, chains } from './config'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'

export const ChainContext = createContext<Chain>(chains[0])

export const ChainProvider = (props: PropsWithChildren<{ value: Chain }>) => (
  <ChainContext.Provider value={props.value}>
    <PolkadotApiIdProvider id={props.value.rpc}>{props.children}</PolkadotApiIdProvider>
  </ChainContext.Provider>
)
