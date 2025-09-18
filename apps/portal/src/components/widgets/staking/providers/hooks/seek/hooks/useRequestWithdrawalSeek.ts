import { useEffect, useMemo } from 'react'
import { useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import { CHAIN_ID, DECIMALS, DEEK_SINGLE_POOL_STAKING_ADDRESS, DEEK_TICKER } from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import { useGetSeekStakerInfo } from './useGetSeekStakerInfo'
import useStakeSeekBase from './useStakeSeekBase'

const useRequestWithdrawalSeek = ({ account }: { account: Account | undefined }) => {
  const {
    newStakedTotal,
    setAmountInput,
    input: { amountInput, decimalAmountInput },
  } = useStakeSeekBase({ account, direction: 'unstake' })

  const { data, isFetched, refetch } = useGetSeekStakerInfo({ account })
  const [staked] = data || [0n, 0n, 0n, 0n]

  const stakedBalance = useMemo(() => {
    return Decimal.fromPlanck(staked, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [staked])

  const _requestWithdrawal = useWagmiWriteContract()
  const requestWithdrawal = {
    ..._requestWithdrawal,
    writeContractAsync: async () =>
      await _requestWithdrawal.writeContractAsync({
        chainId: CHAIN_ID,
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'requestWithdrawal',
        args: [decimalAmountInput?.planck ?? 0n],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const requestWithdrawalTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: requestWithdrawal.data,
  })

  useEffect(() => {
    if (requestWithdrawalTransaction.data?.status === 'success') {
      void refetch()
    }
  }, [refetch, requestWithdrawalTransaction.data?.status])

  const error = useMemo(() => {
    if (decimalAmountInput !== undefined && decimalAmountInput.planck > stakedBalance.planck) {
      return new Error('Insufficient balance')
    }

    return undefined
  }, [decimalAmountInput, stakedBalance])

  const isReady = useMemo(() => {
    return isFetched && decimalAmountInput !== undefined && decimalAmountInput.planck > 0n && !error
  }, [decimalAmountInput, error, isFetched])

  return {
    stakedBalance,
    newStakedTotal,
    setAmountInput,
    input: { amountInput, decimalAmountInput },
    isReady,
    requestWithdrawal,
    requestWithdrawalTransaction,
    error,
  }
}

export default useRequestWithdrawalSeek
