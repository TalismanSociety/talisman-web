import { useQuery } from '@tanstack/react-query'

import { Account } from '@/domains/accounts/recoils'
import { seekPublicClient } from '@/domains/staking/seek/client'
import { SEEK_SINGLE_POOL_STAKING_ADDRESS } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'

const useGetSeekPoolAccountInfo = ({ account }: { account: Account | undefined }) => {
  const address = account?.address as `0x${string}` | undefined
  const { data, isLoading, isError, refetch, isFetched } = useQuery({
    queryKey: ['seek-pool-account-info', address],
    queryFn: async () =>
      await seekPublicClient.multicall({
        contracts: [
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'balanceOf',
            args: [address!],
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'pendingWithdrawals',
            args: [address!],
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'users',
            args: [address!],
          },
          {
            address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
            abi: seekSinglePoolStakingAbi,
            functionName: 'earned',
            args: [address!],
          },
        ],
        allowFailure: false,
      }),
    enabled: address !== undefined,
    refetchInterval: 60_000,
  })

  return { data, isLoading, isError, refetch, isFetched }
}

export default useGetSeekPoolAccountInfo
