import useGetSeekPoolInfo from './useGetSeekPoolInfo'

const useGetSeekStakeUnlockDuration = () => {
  const { data } = useGetSeekPoolInfo()
  const [, , withdrawDelay] = data || [0n, 0n, 0n]
  return Number(withdrawDelay) * 1000 // Convert seconds to milliseconds
}

export default useGetSeekStakeUnlockDuration
