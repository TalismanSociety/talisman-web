// import useStakePercentages from './useStakePercentages'
import { Provider } from '../useProvidersData'
import { nominationPoolsEnabledChainsState } from '@/domains/chains'
import { useRecoilValueLoadable } from 'recoil'

const useNominationPoolsProviders = (): Provider[] => {
  const nominationPoolsLoadable = useRecoilValueLoadable(nominationPoolsEnabledChainsState)
  const nominationPools = nominationPoolsLoadable.valueMaybe()

  const nominationPoolProviders: Provider[] =
    nominationPools?.map(({ chainName, id, nativeToken, rpc, genesisHash }) => {
      return {
        symbol: nativeToken?.symbol,
        logo: nativeToken?.logo,
        chainName,
        chainId: id,
        type: 'Nomination pool',
        provider: chainName,
        stakePercentage: 0,
        actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
        nativeToken,
        rpc,
        genesisHash,
      }
    }) ?? []

  return nominationPoolProviders
}

export default useNominationPoolsProviders
