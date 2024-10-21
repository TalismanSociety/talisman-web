import useAprs from './useAprs'
import useAvailableBalances from './useAvailableBalances'
import useStakePercentages from './useStakePercentages'
import useUnlockDurations from './useUnlockDurations'
import { nominationPoolsEnabledChainsState } from '@/domains/chains'
import { Decimal } from '@talismn/math'
import { useRecoilValue } from 'recoil'

const useNominationPoolsProviders = () => {
  const nominationPools = useRecoilValue(nominationPoolsEnabledChainsState)
  const rpcIds = nominationPools.map(({ rpc }) => rpc ?? '')

  const aprs = useAprs({ rpcIds })
  const unlockDurations = useUnlockDurations({ rpcIds })
  const availableBalances = useAvailableBalances({ rpcIds })
  const stakedPercentages = useStakePercentages({ rpcIds })

  const nominationPoolProviders = nominationPools?.map(({ chainName, id, nativeToken }, index) => {
    const { symbol, logo, decimals } = nativeToken ?? {}
    return {
      symbol,
      logo,
      chainName,
      chainId: id,
      apr: aprs[index]?.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 }),
      type: 'Nomination pool',
      provider: chainName,
      unbondingPeriod: unlockDurations[index],
      availableBalance: Decimal.fromPlanck(availableBalances[index] ?? 0n, decimals ?? 0, {
        currency: symbol,
      }).toLocaleString(),
      stakePercentage: stakedPercentages[index],
      actionLink: `?action=stake&type=nomination-pools&chain=${id}`,
    }
  })

  return nominationPoolProviders
}

export default useNominationPoolsProviders
