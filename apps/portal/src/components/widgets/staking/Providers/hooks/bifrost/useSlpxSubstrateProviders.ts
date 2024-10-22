import { Provider } from '../useProvidersData'
import { slpxSubstratePairsState } from '@/domains/staking/slpxSubstrate/recoils'
import { useAtomValue } from 'jotai'

const useSlpxSubstrateProviders = () => {
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)
  const slpxSubstrateProviders: Provider[] = slpxSubstratePairs.map(
    ({ chainId, nativeToken, substrateChainGenesisHash, apiEndpoint }) => {
      return {
        symbol: nativeToken?.symbol,
        logo: nativeToken?.logo,
        chainName: 'Bifrost',
        chainId,
        type: 'Liquid staking',
        provider: 'Bifrost SLPx',
        unbondingPeriod: '123',
        stakePercentage: 0,
        actionLink: `?action=stake&type=slpx-substrate&native-token=${nativeToken.symbol}`,
        nativeToken,
        rpc: '1234',
        genesisHash: substrateChainGenesisHash,
        apiEndpoint,
      }
    }
  )
  return slpxSubstrateProviders
}
export default useSlpxSubstrateProviders
