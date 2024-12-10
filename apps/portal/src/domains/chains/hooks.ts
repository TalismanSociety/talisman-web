import { useContext } from 'react'

import { ChainContext } from './contexts'
import { chainState } from './recoils'

export const useChainState = () => {
  const { genesisHash } = useContext(ChainContext)
  return chainState({ genesisHash })
}
