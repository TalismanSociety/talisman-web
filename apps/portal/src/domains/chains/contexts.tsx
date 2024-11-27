import type { PropsWithChildren } from 'react'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { createContext, useContext } from 'react'
import { useRecoilValue } from 'recoil'

import type { ChainConfig } from './config'
import { chainState } from '.'
import { chainConfigs } from './config'

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
