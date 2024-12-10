import type { PropsWithChildren } from 'react'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { useContext } from 'react'
import { useRecoilValue } from 'recoil'

import type { ChainConfig } from './config'
import { ChainContext } from './contexts'
import { chainState } from './recoils'

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
