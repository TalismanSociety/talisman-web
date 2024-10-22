import { Provider } from '../useProvidersData'
import { slpxPairsState } from '@/domains/staking/slpx'
import { useRecoilValue } from 'recoil'

const useSlpxProviders = () => {
  const slpxPairs = useRecoilValue(slpxPairsState)

  const slpxProviders: Provider[] = slpxPairs.map(
    ({ chain, nativeToken, substrateChainGenesisHash, splx, apiEndpoint }) => {
      return {
        symbol: nativeToken?.symbol,
        logo: nativeToken?.logo,
        chainName: chain.name,
        chainId: chain.id,
        type: 'Liquid staking',
        provider: 'Bifrost SLPx',
        unbondingPeriod: '123',
        stakePercentage: 0,
        actionLink: `?action=stake&type=slpx&contract-address=${splx}`,
        nativeToken,
        rpc: '1234',
        genesisHash: substrateChainGenesisHash,
        apiEndpoint,
      }
    }
  )

  return slpxProviders
}

export default useSlpxProviders
