import { useReadContracts } from 'wagmi'

import { CHAIN_ID, DEEK_SINGLE_POOL_STAKING_ADDRESS } from '../../../../../../../domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '../../../../../../../domains/staking/seek/seekSinglePoolStakingAbi'

const useGetSeekPoolInfo = () => {
  const { data, isLoading, isError, refetch, isFetched } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'totalStaked',
        chainId: CHAIN_ID,
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'rewardRate',
        chainId: CHAIN_ID,
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'withdrawDelay',
        chainId: CHAIN_ID,
      },
      {
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'minStakeAmount',
        chainId: CHAIN_ID,
      },
    ],
    query: { refetchInterval: 60_000 },
  })

  return { data, isLoading, isError, refetch, isFetched }
}

export default useGetSeekPoolInfo
