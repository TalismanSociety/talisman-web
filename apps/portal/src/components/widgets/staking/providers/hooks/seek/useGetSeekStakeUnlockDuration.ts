import { useGetSeekStakingInfo } from './useGetSeekStakingInfo'

const useGetSeekStakeUnlockDuration = () => {
  const { data } = useGetSeekStakingInfo()
  const [, , withdrawDelay] = data || [0n, 0n, 0n]
  return Number(withdrawDelay) * 1000 // Convert seconds to milliseconds
}

export default useGetSeekStakeUnlockDuration
