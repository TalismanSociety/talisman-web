import { useGetSeekStaked } from '@/components/widgets/staking/providers/hooks/seek/hooks/useGetSeekStaked'

import useGetSeekAvailableBalance from './useGetSeekAvailableBalance'

const useGetSeekStakePercentage = () => {
  const { totalAvailable } = useGetSeekAvailableBalance()
  const {
    data: { totalStaked },
  } = useGetSeekStaked()

  const { amount: totalStakedAmount } = totalStaked

  if (!totalStakedAmount || !totalAvailable || totalAvailable === 0n) return 0

  // We want 5-digit precision: e.g. 0.00001 = 0.001%
  const PRECISION = 1_000_000n

  const scaledPercentage = (totalStakedAmount * PRECISION) / totalAvailable
  const stakedPercentage = Number(scaledPercentage) / Number(PRECISION)

  // Cap at 100% when there's a race condition between fetching available and staked
  if (stakedPercentage > 1) return 1

  return stakedPercentage
}

export default useGetSeekStakePercentage
