import { type PropsWithChildren, createContext } from 'react'
import { type Chain, chains } from './config'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'

export const ChainContext = createContext<Chain>(chains[0])

export const ChainProvider = (props: PropsWithChildren<{ chain: Chain }>) => (
  <ChainContext.Provider value={props.chain}>
    <PolkadotApiIdProvider id={props.chain.rpc}>{props.children}</PolkadotApiIdProvider>
  </ChainContext.Provider>
)
