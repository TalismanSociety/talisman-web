import useGetSeekPoolInfo from './useGetSeekPoolInfo'

const useGetSeekStakeApr = () => {
  const { data } = useGetSeekPoolInfo()
  if (!data) return 0
  const [totalStaked, rewardRate] = data || [0n, 0n]

  // Freshly deployed contracts have 0 staked, reward rate cannot be calculated (infinity).
  if (!totalStaked) {
    return 0
  }

  const SECONDS_IN_YEAR = BigInt(365.25 * 24 * 60 * 60) // 31,536,000 seconds
  const MULTIPLIER = 10_000n // use to preserve decimal precision when working with bigints
  const multipliedApr = (rewardRate * SECONDS_IN_YEAR * MULTIPLIER) / totalStaked
  const apr = (Number(multipliedApr) / Number(MULTIPLIER)) * 1000

  return apr
}

export default useGetSeekStakeApr
