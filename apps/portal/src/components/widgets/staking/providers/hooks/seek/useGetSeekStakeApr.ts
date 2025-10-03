import useGetSeekPoolInfo from './useGetSeekPoolInfo'

const useGetSeekStakeApr = () => {
  const { data } = useGetSeekPoolInfo()
  const [totalStaked, rewardRate] = data || [0n, 0n]

  const SECONDS_IN_MONTH = 30 * 24 * 60 * 60 // 2,592,000 seconds

  const monthlyReturn = (Number(rewardRate) * SECONDS_IN_MONTH) / Number(totalStaked)

  return monthlyReturn
}

export default useGetSeekStakeApr
