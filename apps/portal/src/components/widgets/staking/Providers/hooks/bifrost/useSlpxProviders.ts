import { Provider } from '../useProvidersData'
import { slpxPairsState } from '@/domains/staking/slpx'
import { useRecoilValue } from 'recoil'

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
      stakePercentage: 0,
      actionLink: `?action=stake&type=slpx&contract-address=${splx}`,
      nativeToken,
      rpc: '1234',
      genesisHash: substrateChainGenesisHash,
      apiEndpoint,
      tokenPair: slpxPair,
    }
  })

  return slpxProviders
}

export default useSlpxProviders
