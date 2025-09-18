import { useEffect, useMemo } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, DECIMALS, DEEK_SINGLE_POOL_STAKING_ADDRESS, DEEK_TICKER } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import useGetSeekStaked from './useGetSeekStaked'
import { useGetSeekStakerInfo } from './useGetSeekStakerInfo'

const useClaimEarnedSeek = ({ account }: { account: Account | undefined }) => {
  const { data, isFetched, refetch } = useGetSeekStakerInfo({ account })
  const { refetch: refetchStaked } = useGetSeekStaked()
  const [, , , earned] = data || [0n, 0n, 0n, 0n]

  const earnedBalance = useMemo(() => {
    return Decimal.fromPlanck(earned, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [earned])

  const _getReward = useWagmiWriteContract()
  const getReward = {
    ..._getReward,
    writeContractAsync: async () =>
      await _getReward.writeContractAsync({
        chainId: CHAIN_ID,
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'getReward',
        args: [],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const getRewardTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: getReward.data,
  })

  useEffect(() => {
    if (getRewardTransaction.data?.status === 'success') {
      refetch()
      refetchStaked()
    }
  }, [refetch, getRewardTransaction.data?.status, refetchStaked])

  const isReady = useMemo(() => {
    return isFetched && earnedBalance.planck > 0n
  }, [earnedBalance.planck, isFetched])

  return {
    earnedBalance,
    isReady,
    getReward,
    getRewardTransaction,
  }
}

export default useClaimEarnedSeek
