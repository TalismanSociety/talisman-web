import { useReadContracts } from 'wagmi'

import { Account } from '@/domains/accounts/recoils'

import { CHAIN_ID, DEEK_SINGLE_POOL_STAKING_ADDRESS } from '../../../../../../../domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '../../../../../../../domains/staking/seek/seekSinglePoolStakingAbi'

export const useGetSeekStakerInfo = ({ account }: { account: Account | undefined }) => {
  const { data, isLoading, isError, refetch, isFetched } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'balanceOf',
        chainId: CHAIN_ID,
        args: [account?.address as `0x${string}`],
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'pendingWithdrawals',
        chainId: CHAIN_ID,
        args: [account?.address as `0x${string}`],
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'users',
        chainId: CHAIN_ID,
        args: [account?.address as `0x${string}`],
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'earned',
        chainId: CHAIN_ID,
        args: [account?.address as `0x${string}`],
      },
    ],
    query: {
      refetchInterval: 60_000,
      enabled: account?.address !== undefined,
    },
  })

  return { data, isLoading, isError, refetch, isFetched }
}
