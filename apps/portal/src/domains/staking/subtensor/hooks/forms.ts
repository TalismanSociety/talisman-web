import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import { BigMath } from '@talismn/util'
import { useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

import type { Account } from '@/domains/accounts/recoils'
import { TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR } from '@/components/widgets/staking/subtensor/constants'
import { useNativeTokenAmountState } from '@/domains/chains/recoils'
import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmount, useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { paymentInfoState } from '@/domains/common/recoils'
import { useGetDynamicTaoStakeInfo } from '@/domains/staking/subtensor/hooks/useGetDynamicTaoStakeInfo'

import { MIN_SUBTENSOR_STAKE } from '../atoms/delegates'
import { type StakeItem } from './useStake'

export const useAddStakeForm = (
  account: Account,
  stake: StakeItem | undefined,
  delegate: string | undefined,
  netuid: number | undefined
) => {
  const [api, [accountInfo]] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryMultiState([['system.account', account.address]])])
  )

  const [input, setInput] = useState('')
  const amount = useTokenAmount(input)
  const {
    slippage,
    isLoading: isSlippageLoading,
    expectedAlphaAmount,
    alphaPriceWithSlippageFormatted,
    taoToAlphaTalismanFee,
    alphaToTaoTalismanFeeFormatted,
  } = useGetDynamicTaoStakeInfo({
    amount: amount,
    netuid: netuid ?? 0,
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
  ])

  const [feeEstimate, isFeeEstimateReady] = useStakeFormFeeEstimate(account.address, tx)

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

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => (stake?.totalStaked.decimalAmount?.planck ?? 0n) + (expectedAlphaAmount.decimalAmount?.planck ?? 0n),
      [expectedAlphaAmount.decimalAmount?.planck, stake?.totalStaked.decimalAmount?.planck]
    )
  )

  const minimum = useTokenAmount(String(MIN_SUBTENSOR_STAKE))
  const error = useMemo(() => {
    if (input === '') return
    if ((amount.decimalAmount?.planck ?? 0n) > transferable.decimalAmount.planck)
      return new Error('Insufficient balance')

    if (resulting.decimalAmount && resulting.decimalAmount?.planck < (minimum.decimalAmount?.planck ?? 0n))
      return new Error(`Minimum stake is ${(minimum.decimalAmount ?? 0n).toLocaleString()}`)

    return undefined
  }, [
    amount.decimalAmount?.planck,
    input,
    minimum.decimalAmount,
    resulting.decimalAmount,
    transferable.decimalAmount.planck,
  ])

  const extrinsic = useExtrinsic(tx)

  const ready =
    isFeeEstimateReady &&
    (amount.decimalAmount?.planck ?? 0n) > 0n &&
    error === undefined &&
    delegate &&
    netuid !== undefined &&
    !isSlippageLoading

  return {
    input,
    setInput,
    amount,
    talismanFeeTokenAmount: alphaToTaoTalismanFeeFormatted,
    transferable,
    resulting,
    extrinsic,
    ready,
    error,
    slippage,
    expectedAlphaAmount,
  }
}

export const useUnstakeForm = (stake: StakeItem, delegate: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  const nativeTokenAmount = useRecoilValue(useNativeTokenAmountState())

  const [input, setInput] = useState('')
  const amount = useTokenAmount(input)

  const {
    slippage,
    isLoading: isSlippageLoading,
    // expectedTaoAmount, TODO: Add expectedTaoAmount in uns

    taoPriceWithSlippageFormatted,
    alphaToTaoTalismanFee,
  } = useGetDynamicTaoStakeInfo({
    amount: amount,
    netuid: stake.netuid,
  })

  const limitPrice = taoPriceWithSlippageFormatted.decimalAmount?.planck || 0n
  const allowPartial = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tx: SubmittableExtrinsic<any> = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (api.tx as any)?.subtensorModule?.removeStake?.(delegate, amount.decimalAmount?.planck ?? 0n)
    } catch {
      return api.tx.utility.batchAll([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (api.tx as any)?.subtensorModule?.removeStakeLimit?.(
          delegate,
          stake.netuid,
          amount.decimalAmount?.planck ?? 0n,
          limitPrice,
          allowPartial
        ),
        api.tx.balances.transferKeepAlive(TALISMAN_FEE_RECEIVER_ADDRESS_BITTENSOR, alphaToTaoTalismanFee),
        api.tx.system.remarkWithEvent(`talisman-bittensor`),
      ])
    }
  }, [api.tx, delegate, amount.decimalAmount?.planck, stake.netuid, limitPrice, allowPartial, alphaToTaoTalismanFee])
  const extrinsic = useExtrinsic(tx)

  const available = nativeTokenAmount.fromPlanckOrUndefined(stake.stake, stake?.symbol)

  const minimum = useTokenAmount(String(MIN_SUBTENSOR_STAKE))
  const error = useMemo(() => {
    if (input === '' || !available.decimalAmount) return

    if ((amount.decimalAmount?.planck ?? 0n) > available.decimalAmount.planck) return new Error('Insufficient balance')

    if (
      amount.decimalAmount &&
      available.decimalAmount.planck - amount.decimalAmount.planck > 0n &&
      available.decimalAmount.planck - amount.decimalAmount.planck < (minimum.decimalAmount?.planck ?? 0n)
    ) {
      return new Error(`Need ${minimum.decimalAmount?.toLocaleString?.()} to keep staking`)
    }

    return undefined
  }, [amount.decimalAmount, available.decimalAmount, input, minimum.decimalAmount])

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => BigMath.max(0n, (available?.decimalAmount?.planck ?? 0n) - (amount.decimalAmount?.planck ?? 0n)),
      [amount.decimalAmount?.planck, available.decimalAmount?.planck]
    )
  )

  const ready = (amount.decimalAmount?.planck ?? 0n) > 0n && error === undefined && !isSlippageLoading

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
