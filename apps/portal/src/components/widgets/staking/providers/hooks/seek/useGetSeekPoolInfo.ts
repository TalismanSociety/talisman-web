import { useQuery } from '@tanstack/react-query'

import { seekPublicClient } from '@/domains/staking/seek/client'
import { SEEK_SINGLE_POOL_STAKING_ADDRESS } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'

const useGetSeekPoolInfo = () => {
  const { data, isLoading, isError, refetch, isFetched } = useQuery({
    queryKey: ['seek-pool-info'],
    queryFn: async () =>
      await seekPublicClient.multicall({
        contracts: [
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'totalStaked',
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'rewardRate',
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'withdrawDelay',
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'minStakeAmount',
          },
        ],
        allowFailure: false,
      }),
    refetchInterval: 60_000,
  })

  return { data, isLoading, isError, refetch, isFetched }
}

export default useGetSeekPoolInfo
