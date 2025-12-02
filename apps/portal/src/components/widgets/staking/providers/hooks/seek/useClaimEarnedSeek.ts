import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, DECIMALS, SEEK_SINGLE_POOL_STAKING_ADDRESS, SEEK_TICKER } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import useGetSeekAvailableBalance from './useGetSeekAvailableBalance'
import useGetSeekPoolAccountInfo from './useGetSeekPoolAccountInfo'
import { SEEK_REWARDS_PAID_BY_USER_QUERY_KEY } from './useGetSeekRewardsPaidByUser'
import useGetSeekStaked from './useGetSeekStaked'

const useClaimEarnedSeek = ({ account }: { account: Account | undefined }) => {
  const { data, isFetched, refetch } = useGetSeekPoolAccountInfo({ account })
  const { refetch: refetchStaked } = useGetSeekStaked()
  const { refetch: refetchSeekBalances } = useGetSeekAvailableBalance()
  const [, , , earned] = data || [0n, 0n, 0n, 0n]
  const queryClient = useQueryClient()

  const earnedBalance = useMemo(() => {
    return Decimal.fromPlanck(earned, DECIMALS ?? 0, { currency: SEEK_TICKER })
  }, [earned])

  const _getReward = useWagmiWriteContract()
  const getReward = {
    ..._getReward,
    writeContractAsync: async () =>
      await _getReward.writeContractAsync({
        chainId: CHAIN_ID,
        address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'getReward',
        args: [],
        etherscanUrl: mainnet.blockExplorers.default.url,
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
      refetchSeekBalances()
      const indexerCooldown = 12_000
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: [SEEK_REWARDS_PAID_BY_USER_QUERY_KEY, account?.address.toLowerCase()],
        })
      }, indexerCooldown)
    }
  }, [refetch, getRewardTransaction.data?.status, refetchStaked, refetchSeekBalances, queryClient, account?.address])

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
