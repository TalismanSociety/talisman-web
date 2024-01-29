import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { createContext, useContext, type PropsWithChildren } from 'react'
import { chainState } from '.'
import { chainConfigs, type ChainConfig } from './config'

export const ChainContext = createContext<ChainConfig>(chainConfigs[0])

export const ChainProvider = (props: PropsWithChildren<{ chain: ChainConfig }>) => (
  <ChainContext.Provider value={props.chain}>
    <PolkadotApiIdProvider id={props.chain.genesisHash}>{props.children}</PolkadotApiIdProvider>
  </ChainContext.Provider>
)

export const useChainState = () => {
  const { genesisHash } = useContext(ChainContext)
  return chainState({ genesisHash })
}
