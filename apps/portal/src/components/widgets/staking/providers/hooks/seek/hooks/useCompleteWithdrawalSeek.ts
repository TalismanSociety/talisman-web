import { formatDistanceToNow } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, DECIMALS, DEEK_SINGLE_POOL_STAKING_ADDRESS, DEEK_TICKER } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import useGetSeekPoolAccountInfo from './useGetSeekPoolAccountInfo'
import useGetSeekStaked from './useGetSeekStaked'

const useCompleteWithdrawalSeek = ({ account }: { account: Account | undefined }) => {
  const { data, refetch } = useGetSeekPoolAccountInfo({ account })
  const { refetch: refetchStaked } = useGetSeekStaked()
  const [, pendingWithdrawals] = data || [0n, [0n, 0n], 0n, 0n]
  const [amount, unlockTimestamp] = pendingWithdrawals || [0n, 0n]

  const pendingWithdrawalsBalance = useMemo(() => {
    return Decimal.fromPlanck(amount, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [amount])

  const isReady = useMemo(() => {
    const now = Math.floor(Date.now() / 1000) // Current timestamp in seconds
    return amount > 0n && unlockTimestamp <= now
  }, [amount, unlockTimestamp])

  const etaString = useMemo(() => {
    if (unlockTimestamp === 0n) return ''
    const unlockDate = new Date(Number(unlockTimestamp) * 1000) // Convert to milliseconds
    return formatDistanceToNow(unlockDate, { addSuffix: true })
  }, [unlockTimestamp])

  const _completeWithdrawal = useWagmiWriteContract()
  const completeWithdrawal = {
    ..._completeWithdrawal,
    writeContractAsync: async () =>
      await _completeWithdrawal.writeContractAsync({
        chainId: CHAIN_ID,
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'completeWithdrawal',
        args: [],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const completeWithdrawalTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: completeWithdrawal.data,
  })

  useEffect(() => {
    if (completeWithdrawalTransaction.data?.status === 'success') {
      refetch()
      refetchStaked()
    }
  }, [refetch, completeWithdrawalTransaction.data?.status, refetchStaked])

  return {
    pendingWithdrawalsBalance,
    unlockTimestamp,
    etaString,
    isReady,
    completeWithdrawal,
    completeWithdrawalTransaction,
  }
}

export default useCompleteWithdrawalSeek
