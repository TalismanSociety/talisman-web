import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { PropsWithChildren, createContext } from 'react'

import { Chain, chains } from './config'

export const ChainContext = createContext<Chain>(chains[0])

export const ChainProvider = (props: PropsWithChildren<{ chain: Chain }>) => (
  <ChainContext.Provider value={props.chain}>
    <PolkadotApiIdProvider id={props.chain.rpc}>{props.children}</PolkadotApiIdProvider>
  </ChainContext.Provider>
)
