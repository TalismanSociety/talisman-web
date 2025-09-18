import { useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, DEEK_SINGLE_POOL_STAKING_ADDRESS } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'

import { useGetSeekStakerInfo } from './useGetSeekStakerInfo'

const useCancelWithdrawalSeek = ({ account }: { account: Account | undefined }) => {
  const { refetch } = useGetSeekStakerInfo({ account })

  const _cancelWithdrawal = useWagmiWriteContract()
  const cancelWithdrawal = {
    ..._cancelWithdrawal,
    writeContractAsync: async () =>
      await _cancelWithdrawal.writeContractAsync({
        chainId: CHAIN_ID,
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'cancelWithdrawal',
        args: [],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const cancelWithdrawalTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: cancelWithdrawal.data,
  })

  useEffect(() => {
    if (cancelWithdrawalTransaction.data?.status === 'success') {
      refetch()
    }
  }, [refetch, cancelWithdrawalTransaction.data?.status])

  return {
    cancelWithdrawal,
    cancelWithdrawalTransaction,
  }
}

export default useCancelWithdrawalSeek
