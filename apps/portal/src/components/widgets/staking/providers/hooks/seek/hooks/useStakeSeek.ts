import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { erc20Abi } from 'viem'
import { useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Account } from '@/domains/accounts/recoils'
import { useWagmiWriteContract } from '@/domains/common/hooks/useWagmiWriteContract'
import {
  CHAIN_ID,
  DECIMALS,
  DEEK_SINGLE_POOL_STAKING_ADDRESS,
  DEEK_TICKER,
  DEEK_TOKEN_ADDRESS,
} from '@/domains/staking/seek/constants'
import seekSinglePoolStakingAbi from '@/domains/staking/seek/seekSinglePoolStakingAbi'
import { Decimal } from '@/util/Decimal'

import { useGetSeekStakerInfo } from './useGetSeekStakerInfo'
import { useGetSeekStakingInfo } from './useGetSeekStakingInfo'
import useStakeSeekBase from './useStakeSeekBase'

const useStakeSeek = ({ account }: { account: Account | undefined }) => {
  const navigate = useNavigate()
  const {
    available,
    newStakedTotal,
    setAmountInput,
    input: { amountInput, decimalAmountInput },
  } = useStakeSeekBase({ account, direction: 'stake' })

  const { data } = useGetSeekStakingInfo()
  const { refetch: refetchStakerInfo } = useGetSeekStakerInfo({ account })
  const [, , , minStakeAmount] = data || [0n, 0n, 0n, 0n]

  const {
    data: allowance,
    isLoading: _isLoading,
    isFetched,
    error: _error,
    refetch,
  } = useReadContract({
    chainId: CHAIN_ID,
    address: DEEK_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [(account?.address ?? '0x') as `0x${string}`, DEEK_SINGLE_POOL_STAKING_ADDRESS as `0x${string}`],
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
        address: DEEK_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [DEEK_SINGLE_POOL_STAKING_ADDRESS as `0x${string}`, decimalAmountInput?.planck ?? 0n],
        etherscanUrl: CHAIN_ID === polygon.id ? polygon.blockExplorers.default.url : mainnet.blockExplorers.default.url,
      }),
  }

  const approveTransaction = useWaitForTransactionReceipt({
    chainId: CHAIN_ID,
    hash: approve.data,
  })

  useEffect(() => {
    if (approveTransaction.data?.status === 'success') {
      void refetch()
    }
  }, [refetch, approveTransaction.data?.status])

  const _stake = useWagmiWriteContract()
  const stake = {
    ..._stake,
    writeContractAsync: async () =>
      await _stake.writeContractAsync({
        chainId: CHAIN_ID,
        address: DEEK_SINGLE_POOL_STAKING_ADDRESS,
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
      navigate('/staking/positions')
    }
  }, [stakeTransaction.data?.status, navigate, refetchStakerInfo])

  const approvalNeeded = useMemo(() => {
    return allowance !== undefined && decimalAmountInput !== undefined && decimalAmountInput.planck > allowance
  }, [allowance, decimalAmountInput])

  const minAmount = useMemo(() => {
    return Decimal.fromPlanck(minStakeAmount, DECIMALS ?? 0, { currency: DEEK_TICKER })
  }, [minStakeAmount])

  const error = useMemo(() => {
    if (decimalAmountInput !== undefined && decimalAmountInput.planck < minAmount.planck) {
      return new Error(`Minimum ${minAmount.toLocaleString()} needed`)
    }

    if (decimalAmountInput !== undefined && decimalAmountInput.planck > available.planck) {
      return new Error('Insufficient balance')
    }

    return undefined
  }, [decimalAmountInput, minAmount, available])

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
    available,
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
