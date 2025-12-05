import { useEffect } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, SEEK_SINGLE_POOL_STAKING_ADDRESS } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'

import useGetSeekPoolAccountInfo from './useGetSeekPoolAccountInfo'
import useGetSeekStaked from './useGetSeekStaked'

const useCancelWithdrawalSeek = ({ account }: { account: Account | undefined }) => {
  const { refetch } = useGetSeekPoolAccountInfo({ account })
  const { refetch: refetchSeekStaked } = useGetSeekStaked()

  const _cancelWithdrawal = useWagmiWriteContract()
  const cancelWithdrawal = {
    ..._cancelWithdrawal,
    writeContractAsync: async () =>
      await _cancelWithdrawal.writeContractAsync({
        chainId: CHAIN_ID,
        address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'cancelWithdrawal',
        args: [],
        etherscanUrl: mainnet.blockExplorers.default.url,
      }),
  }

  const cancelWithdrawalTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: cancelWithdrawal.data,
  })

  useEffect(() => {
    if (cancelWithdrawalTransaction.data?.status === 'success') {
      refetch()
      refetchSeekStaked()
    }
  }, [refetch, cancelWithdrawalTransaction.data?.status, refetchSeekStaked])

  return {
    cancelWithdrawal,
    cancelWithdrawalTransaction,
  }
}

export default useCancelWithdrawalSeek
