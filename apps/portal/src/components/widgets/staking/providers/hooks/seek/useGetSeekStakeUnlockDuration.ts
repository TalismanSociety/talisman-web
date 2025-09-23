import useGetSeekPoolInfo from './useGetSeekPoolInfo'

const DEFAULT_WITHDRAW_DELAY = 604800n // 7 days

const useGetSeekStakeUnlockDuration = () => {
  const { data } = useGetSeekPoolInfo()
  const [, , withdrawDelay] = data || [0n, 0n, DEFAULT_WITHDRAW_DELAY]

  return Number(withdrawDelay) * 1000 // Convert seconds to milliseconds
}

export default useGetSeekStakeUnlockDuration
