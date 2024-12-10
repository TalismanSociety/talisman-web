import { useAtomValue } from 'jotai'

import { slpxSubstratePairsState } from '@/domains/staking/slpxSubstrate/recoils'

import { Provider } from '../types'

const useSlpxSubstrateProviders = () => {
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)
  const slpxSubstrateProviders: Provider[] = slpxSubstratePairs.map(slpxPair => {
    const { chainId, nativeToken, substrateChainGenesisHash, apiEndpoint } = slpxPair
    return {
      symbol: nativeToken?.symbol,
      logo: nativeToken?.logo,
      chainName: 'Bifrost',
      chainId,
      type: 'Liquid staking',
      typeId: 'liquidStakingSlpxSubstrate',
      provider: 'Bifrost SLPx',
      actionLink: `?action=stake&type=slpx-substrate&native-token=${nativeToken.symbol}`,
      nativeToken,
      genesisHash: substrateChainGenesisHash,
      apiEndpoint,
      tokenPair: slpxPair,
    }
  })
  return slpxSubstrateProviders
}
export default useSlpxSubstrateProviders
