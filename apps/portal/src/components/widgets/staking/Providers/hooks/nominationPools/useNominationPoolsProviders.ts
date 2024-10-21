// import useAvailableBalances from './useAvailableBalances'
// import useStakePercentages from './useStakePercentages'
import { Provider } from '../useProvidersData'
import useUnlockDurations from './useUnlockDurations'
import { nominationPoolsEnabledChainsState } from '@/domains/chains'
import { useRecoilValueLoadable } from 'recoil'

const useNominationPoolsProviders = (): Provider[] => {
  const nominationPoolsLoadable = useRecoilValueLoadable(nominationPoolsEnabledChainsState)
  const nominationPools = nominationPoolsLoadable.valueMaybe()
  const rpcIds = nominationPools?.map(({ rpc }) => rpc ?? '') ?? []

  const unlockDurations = useUnlockDurations({ rpcIds })
  // const availableBalances = useAvailableBalances({ rpcIds })
  // const stakedPercentages = useStakePercentages({ rpcIds })

  const nominationPoolProviders: Provider[] =
    nominationPools?.map(({ chainName, id, nativeToken, rpc }, index) => {
      return {
        symbol: nativeToken?.symbol,
        logo: nativeToken?.logo,
        chainName,
        chainId: id,
        type: 'Nomination pool',
        provider: chainName,
        unbondingPeriod: unlockDurations?.[index],
        // availableBalance: availableBalances[index] ?? 0n,
        // stakePercentage: stakedPercentages[index],
        availableBalance: 0n,
        stakePercentage: 0,
        actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
        nativeToken,
        rpc,
      }
    }) ?? []

  return nominationPoolProviders
}

export default useNominationPoolsProviders
