import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import { BigMath } from '@talismn/util'
import { useSetAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import {
  MIN_SUBTENSOR_ALPHA_STAKE,
  MIN_SUBTENSOR_ROOTNET_STAKE,
  ROOT_NETUID,
  TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR,
} from '@/components/widgets/staking/subtensor/constants'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmount, useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { paymentInfoState } from '@/domains/common/recoils'
import { useGetDynamicTaoStakeInfo } from '@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo'

import { feeEstimateAtom } from '../atoms/feeEstimate'
import { type StakeItem } from './useStake'

export const useAddStakeForm = (
  account: Account,
  stake: StakeItem | undefined,
  delegate: string | undefined,
  netuid: number | undefined
) => {
  const [input, setInput] = useState('')
  const setFeeEstimate = useSetAtom(feeEstimateAtom)

  const [api, [accountInfo]] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryMultiState([['system.account', account.address]])])
  )
  const amount = useTokenAmount(input)

  const isRootnetStake = netuid === ROOT_NETUID

  const {
    slippage,
    isLoading: isSlippageLoading,
    error: isDynamicTaoStakeInfoError,
    expectedAlphaAmount,
    alphaPriceWithSlippageFormatted,
    taoToAlphaTalismanFee,
    taoToAlphaTalismanFeeFormatted,
    calculateExpectedTaoFromAlpha,
  } = useGetDynamicTaoStakeInfo({
    amount: amount,
    netuid: netuid ?? 0,
    direction: 'taoToAlpha',
    shouldUpdateFeeAndSlippage: !isRootnetStake,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx: SubmittableExtrinsic<any> = useMemo(() => {
    if (!delegate || netuid === undefined) {
      // Return a dummy transaction if delegate or netuid is missing
      return api.tx.system.remarkWithEvent('talisman-bittensor')
    }

    const limitPrice = alphaPriceWithSlippageFormatted.decimalAmount?.planck || 0n
    const allowPartial = false

    try {
      return api.tx.utility.batchAll([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (api.tx as any)?.subtensorModule?.addStake?.(delegate, amount.decimalAmount?.planck ?? 0n),
        api.tx.balances.transferKeepAlive(TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR, taoToAlphaTalismanFee),
        api.tx.system.remarkWithEvent(`talisman-bittensor`),
      ])
    } catch {
      if (isRootnetStake) {
        return api.tx.utility.batchAll([
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (api.tx as any)?.subtensorModule?.addStake?.(delegate, netuid, amount.decimalAmount?.planck ?? 0n),
          api.tx.system.remarkWithEvent(`talisman-bittensor`),
        ])
      }
      return api.tx.utility.batchAll([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (api.tx as any)?.subtensorModule?.addStakeLimit?.(
          delegate,
          netuid,
          amount.decimalAmount?.planck ?? 0n,
          limitPrice,
          allowPartial
        ),
        api.tx.balances.transferKeepAlive(TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR, taoToAlphaTalismanFee),
        api.tx.system.remarkWithEvent(`talisman-bittensor`),
      ])
    }
  }, [
    delegate,
    netuid,
    alphaPriceWithSlippageFormatted.decimalAmount?.planck,
    api.tx,
    amount.decimalAmount?.planck,
    taoToAlphaTalismanFee,
    isRootnetStake,
  ])

  const [feeEstimate, isFeeEstimateReady] = useStakeFormFeeEstimate(account.address, tx)

  const formattedFeeEstimate = useTokenAmountFromPlanck(feeEstimate)

  useEffect(() => {
    setFeeEstimate(formattedFeeEstimate)
  }, [formattedFeeEstimate, setFeeEstimate])

  const existentialDeposit = useMemo(
    () => api.consts.balances.existentialDeposit.toBigInt(),
    [api.consts.balances.existentialDeposit]
  )

  const transferablePlanck = useMemo(() => {
    //
    // This diagram shows the relationship between these balance properties:
    //
    // |--------------------------total--------------------------|
    // |---reserved---|-------------------free-------------------|
    //                |--untouchable--|
    //                |-ed-| // existentialDeposit
    // |------------frozen------------|-------transferable-------|
    //
    // To calculate `transferable`:
    // 1. first we need to derive `untouchable`,
    // 2. then we need to ensure that `untouchable` is never smaller than `ed`
    // 3. finally we need to subtract `untouchable` from `free`.
    //
    const reserved = accountInfo.data.reserved.toBigInt()
    const frozen = accountInfo.data.frozen.toBigInt()
    const untouchable = BigMath.max(frozen - reserved, 0n)

    // make sure untouchable is never less than the existentialDeposit
    const untouchableOrEd = BigMath.max(untouchable, existentialDeposit)

    const free = accountInfo.data.free.toBigInt()
    const transferable = BigMath.max(free - (untouchableOrEd + taoToAlphaTalismanFee), 0n)

    return transferable - feeEstimate
  }, [
    accountInfo.data.free,
    accountInfo.data.frozen,
    accountInfo.data.reserved,
    existentialDeposit,
    feeEstimate,
    taoToAlphaTalismanFee,
  ])

  const transferable = useTokenAmountFromPlanck(transferablePlanck)

  // resulting alpha
  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => (stake?.totalStaked.decimalAmount?.planck ?? 0n) + (expectedAlphaAmount.decimalAmount?.planck ?? 0n),
      [expectedAlphaAmount.decimalAmount?.planck, stake?.totalStaked.decimalAmount?.planck]
    )
  )

  const resultingAlphaInTao = calculateExpectedTaoFromAlpha({
    alphaStaked: resulting.decimalAmount?.toNumber() ?? 0,
  })

  const resultingAlphaInTaoAmount = useTokenAmount(resultingAlphaInTao.toString())

  const resultingTao = useTokenAmountFromPlanck(
    useMemo(
      () => (stake?.totalStaked.decimalAmount?.planck ?? 0n) + (amount.decimalAmount?.planck ?? 0n),
      [amount.decimalAmount?.planck, stake?.totalStaked.decimalAmount?.planck]
    )
  )

  const minimum = useTokenAmount(String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : MIN_SUBTENSOR_ALPHA_STAKE))
  const error = useMemo(() => {
    if (input === '') return
    if ((amount.decimalAmount?.planck ?? 0n) > transferable.decimalAmount.planck)
      return new Error('Insufficient balance')

    if ((amount.decimalAmount?.planck ?? 0n) < (minimum.decimalAmount?.planck ?? 0n)) {
      return new Error(`Minimum stake is ${minimum.decimalAmount?.toLocaleStringPrecision()}`)
    }

    if (isDynamicTaoStakeInfoError) {
      return new Error('Failed to fetch dynamic tao stake info')
    }

    return undefined
  }, [
    amount.decimalAmount?.planck,
    input,
    isDynamicTaoStakeInfoError,
    minimum.decimalAmount,
    transferable.decimalAmount.planck,
  ])

  const extrinsic = useExtrinsic(tx)

  const ready =
    isFeeEstimateReady &&
    (amount.decimalAmount?.planck ?? 0n) > 0n &&
    error === undefined &&
    delegate &&
    netuid !== undefined &&
    !isSlippageLoading &&
    !isDynamicTaoStakeInfoError

  return {
    input,
    setInput,
    amount,
    talismanFeeTokenAmount: isRootnetStake ? undefined : taoToAlphaTalismanFeeFormatted,
    transferable,
    resulting,
    resultingTao,
    extrinsic,
    ready,
    error,
    slippage,
    expectedAlphaAmount,
    isLoading: extrinsic.state === 'loading' || isSlippageLoading,
    resultingAlphaInTaoAmount,
  }
}

export const useUnstakeForm = (account: Account, stake: StakeItem, delegate: string) => {
  const setFeeEstimate = useSetAtom(feeEstimateAtom)
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const [input, setInput] = useState('')
  const amount = useTokenAmount(input)
  const isRootnetStake = stake.netuid === ROOT_NETUID

  const {
    alphaToTaoSlippage: slippage,
    isLoading: isSlippageLoading,
    error: isDynamicTaoStakeInfoError,
    expectedTaoAmount,
    minAlphaUnstake,
    taoPriceWithSlippageFormatted,
    alphaToTaoTalismanFee,
    alphaToTaoTalismanFeeFormatted,
    taoToAlphaTalismanFee,
    taoToAlphaTalismanFeeFormatted,
    calculateExpectedTaoFromAlpha,
  } = useGetDynamicTaoStakeInfo({
    amount: amount,
    netuid: stake.netuid,
    direction: 'alphaToTao',
    shouldUpdateFeeAndSlippage: !isRootnetStake,
  })

  const talismanFeeTxTokenAmount = isRootnetStake ? taoToAlphaTalismanFee : alphaToTaoTalismanFee
  const talismanFeeTokenAmount = isRootnetStake ? taoToAlphaTalismanFeeFormatted : alphaToTaoTalismanFeeFormatted

  const limitPrice = taoPriceWithSlippageFormatted.decimalAmount?.planck || 0n
  const allowPartial = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx: SubmittableExtrinsic<any> = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api.tx as any)?.subtensorModule?.removeStake?.(delegate, amount.decimalAmount?.planck ?? 0n)
    } catch {
      if (isRootnetStake) {
        return api.tx.utility.batchAll([
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (api.tx as any)?.subtensorModule?.removeStake?.(delegate, stake.netuid, amount.decimalAmount?.planck ?? 0n),
          api.tx.system.remarkWithEvent(`talisman-bittensor`),
        ])
      }
      return api.tx.utility.batchAll([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (api.tx as any)?.subtensorModule?.removeStakeLimit?.(
          delegate,
          stake.netuid,
          amount.decimalAmount?.planck ?? 0n,
          limitPrice,
          allowPartial
        ),
        api.tx.balances.transferKeepAlive(TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR, talismanFeeTxTokenAmount),
        api.tx.system.remarkWithEvent(`talisman-bittensor`),
      ])
    }
  }, [
    api.tx,
    delegate,
    amount.decimalAmount?.planck,
    isRootnetStake,
    stake.netuid,
    limitPrice,
    allowPartial,
    talismanFeeTxTokenAmount,
  ])
  const extrinsic = useExtrinsic(tx)

  const [feeEstimate] = useStakeFormFeeEstimate(account.address, tx)

  const formattedFeeEstimate = useTokenAmountFromPlanck(feeEstimate)

  useEffect(() => {
    setFeeEstimate(formattedFeeEstimate)
  }, [formattedFeeEstimate, setFeeEstimate])

  const available = nativeTokenAmount.fromPlanckOrUndefined(stake.stake, stake?.symbol)

  const minimum = useTokenAmount(String(isRootnetStake ? MIN_SUBTENSOR_ROOTNET_STAKE : minAlphaUnstake))
  const minimumFormatted = nativeTokenAmount.fromPlanckOrUndefined(minimum.decimalAmount?.planck ?? 0n, stake?.symbol)

  const error = useMemo(() => {
    if (input === '' || !available.decimalAmount) return

    if ((amount.decimalAmount?.planck ?? 0n) > available.decimalAmount.planck) return new Error('Insufficient balance')

    if ((amount.decimalAmount?.planck ?? 0n) < (minimumFormatted.decimalAmount?.planck ?? 0n)) {
      return new Error(`Minimum unstake amount is ${minimumFormatted.decimalAmount?.toLocaleStringPrecision()}`)
    }

    if (
      amount.decimalAmount &&
      available.decimalAmount.planck - amount.decimalAmount.planck > 0n &&
      available.decimalAmount.planck - amount.decimalAmount.planck < (minimumFormatted.decimalAmount?.planck ?? 0n)
    ) {
      return new Error(`You must keep ${minimumFormatted.decimalAmount?.toLocaleString?.()} to continue staking`)
    }

    if (isDynamicTaoStakeInfoError) {
      return new Error('Failed to fetch dynamic tao stake info')
    }

    return undefined
  }, [amount.decimalAmount, available.decimalAmount, input, isDynamicTaoStakeInfoError, minimumFormatted.decimalAmount])

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => BigMath.max(0n, (available?.decimalAmount?.planck ?? 0n) - (amount.decimalAmount?.planck ?? 0n)),
      [amount.decimalAmount?.planck, available.decimalAmount?.planck]
    )
  )

  const resultingAlphaInTao = calculateExpectedTaoFromAlpha({
    alphaStaked: resulting.decimalAmount?.toNumber() ?? 0,
  })

  const resultingAlphaInTaoAmount = useTokenAmount(resultingAlphaInTao.toString())

  const ready =
    (amount.decimalAmount?.planck ?? 0n) > 0n &&
    error === undefined &&
    !isSlippageLoading &&
    !isDynamicTaoStakeInfoError

  return {
    input,
    setInput,
    amount,
    available,
    resulting,
    extrinsic,
    ready,
    error,
    alphaToTaoSlippage: slippage,
    expectedTaoAmount,
    isLoading: extrinsic.state === 'loading' || isSlippageLoading,
    talismanFeeTokenAmount: isRootnetStake ? undefined : talismanFeeTokenAmount,
    resultingAlphaInTaoAmount,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStakeFormFeeEstimate = (origin: string, tx: SubmittableExtrinsic<any>) => {
  const paymentInfoLoadable = useRecoilValueLoadable(
    paymentInfoState([
      useSubstrateApiEndpoint(),
      // @ts-expect-error
      tx.method.section,
      // @ts-expect-error
      tx.method.method,
      origin,
      ...tx.args,
    ])
  )
  return useMemo(
    () =>
      [
        BigInt(paymentInfoLoadable.valueMaybe()?.partialFee?.toString?.(10) ?? '0'),
        paymentInfoLoadable.state === 'hasValue',
      ] as const,
    [paymentInfoLoadable]
  )
}
