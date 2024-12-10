import { useRecoilValue } from 'recoil'

import { slpxPairsState } from '@/domains/staking/slpx'

import { Provider } from '../types'

const useSlpxProviders = () => {
  const slpxPairs = useRecoilValue(slpxPairsState)

  const slpxProviders: Provider[] = slpxPairs.map(slpxPair => {
    const { chain, nativeToken, substrateChainGenesisHash, apiEndpoint, splx } = slpxPair
    return {
      symbol: nativeToken?.symbol,
      logo: nativeToken?.logo,
      chainName: chain.name,
      chainId: chain.id,
      type: 'Liquid staking',
      typeId: 'liquidStakingSlpx',
      provider: 'Bifrost SLPx',
      actionLink: `?action=stake&type=slpx&contract-address=${splx}`,
      nativeToken,
      genesisHash: substrateChainGenesisHash,
      apiEndpoint,
      tokenPair: slpxPair,
    }
  })

  return slpxProviders
}

export default useSlpxProviders
