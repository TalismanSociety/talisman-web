import { useEffect, useMemo } from 'react'
import { erc20Abi } from 'viem'
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import {
  CHAIN_ID,
  DECIMALS,
  SEEK_SINGLE_POOL_STAKING_ADDRESS,
  SEEK_TICKER,
  SEEK_TOKEN_ADDRESS,
} from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import useGetSeekPoolAccountInfo from './useGetSeekPoolAccountInfo'
import useGetSeekPoolInfo from './useGetSeekPoolInfo'
import useGetSeekStaked from './useGetSeekStaked'
import useStakeSeekBase from './useStakeSeekBase'

const useStakeSeek = ({
  account,
  onTransactionSuccess,
}: {
  account: Account | undefined
  onTransactionSuccess: () => void
}) => {
  const {
    balanceByWalletAddress,
    newStakedTotal,
    setAmountInput,
    refetchSeekBalances,
    input: { amountInput, decimalAmountInput },
  } = useStakeSeekBase({ account, direction: 'stake' })

  const { data } = useGetSeekPoolInfo()
  const [, , , minStakeAmount] = data || [0n, 0n, 0n, 0n]

  const { refetch: refetchStakerInfo } = useGetSeekPoolAccountInfo({ account })

  const { refetch: refetchSeekStaked } = useGetSeekStaked()

  const {
    data: allowance,
    isLoading: _isLoading,
    isFetched,
    error: _error,
    refetch: refetchAllowance,
  } = useReadContract({
    chainId: CHAIN_ID,
    address: SEEK_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [(account?.address ?? '0x') as `0x${string}`, SEEK_SINGLE_POOL_STAKING_ADDRESS as `0x${string}`],
    query: {
      enabled: account?.address !== undefined,
    },
  })

  const _approve = useWagmiWriteContract()
  const approve = {
    ..._approve,
    writeContractAsync: async () =>
      await _approve.writeContractAsync({
        chainId: CHAIN_ID,
        address: SEEK_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [SEEK_SINGLE_POOL_STAKING_ADDRESS as `0x${string}`, decimalAmountInput?.planck ?? 0n],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const approveTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: approve.data,
  })

  useEffect(() => {
    if (approveTransaction.data?.status === 'success') {
      void refetchAllowance()
    }
  }, [refetchAllowance, approveTransaction.data?.status])

  const _stake = useWagmiWriteContract()
  const stake = {
    ..._stake,
    writeContractAsync: async () =>
      await _stake.writeContractAsync({
        chainId: CHAIN_ID,
        address: SEEK_SINGLE_POOL_STAKING_ADDRESS,
        abi: seekSinglePoolStakingAbi,
        functionName: 'stake',
        args: [decimalAmountInput?.planck ?? 0n],
        etherscanUrl: polygon.blockExplorers.default.url,
      }),
  }

  const stakeTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: stake.data,
  })

  useEffect(() => {
    if (stakeTransaction.data?.status === 'success') {
      refetchStakerInfo()
      refetchAllowance()
      refetchSeekStaked()
      refetchSeekBalances()
      onTransactionSuccess()
    }
  }, [
    stakeTransaction.data?.status,
    refetchStakerInfo,
    onTransactionSuccess,
    refetchAllowance,
    refetchSeekStaked,
    refetchSeekBalances,
  ])

  const approvalNeeded = useMemo(() => {
    return allowance !== undefined && decimalAmountInput !== undefined && decimalAmountInput.planck > allowance
  }, [allowance, decimalAmountInput])

  const minAmount = useMemo(() => {
    return Decimal.fromPlanck(minStakeAmount, DECIMALS ?? 0, { currency: SEEK_TICKER })
  }, [minStakeAmount])

  const error = useMemo(() => {
    if (decimalAmountInput !== undefined && decimalAmountInput.planck < minAmount.planck) {
      return new Error(`Minimum ${minAmount.toLocaleString()} needed`)
    }

    if (
      decimalAmountInput !== undefined &&
      decimalAmountInput.planck > balanceByWalletAddress.availableBalance.planck
    ) {
      return new Error('Insufficient balance')
    }

    return undefined
  }, [decimalAmountInput, minAmount, balanceByWalletAddress])

  const isReady = useMemo(() => {
    return (
      isFetched &&
      allowance !== undefined &&
      decimalAmountInput !== undefined &&
      decimalAmountInput.planck > 0n &&
      !error
    )
  }, [isFetched, allowance, decimalAmountInput, error])

  return {
    balanceByWalletAddress,
    newStakedTotal,
    setAmountInput,
    input: { amountInput, decimalAmountInput },
    allowance,
    isReady,
    approvalNeeded,
    approve,
    approveTransaction,
    stake,
    stakeTransaction,
    error,
  }
}

export default useStakeSeek
