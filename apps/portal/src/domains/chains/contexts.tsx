import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { createContext, useContext, type PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { chainState } from '.'
import { chainConfigs, type ChainConfig } from './config'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const ChainContext = createContext<ChainConfig>(chainConfigs[0]!)

export const ChainProvider = (props: PropsWithChildren<{ chain: ChainConfig }>) => (
  <ChainContext.Provider value={props.chain}>
    <PolkadotApiIdProvider id={useRecoilValue(chainState({ genesisHash: props.chain.genesisHash })).rpc}>
      {props.children}
    </PolkadotApiIdProvider>
  </ChainContext.Provider>
)

export const useChainState = () => {
  const { genesisHash } = useContext(ChainContext)
  return chainState({ genesisHash })
}
