import type { Account } from '../../../accounts'
import {
  paymentInfoState,
  useExtrinsic,
  useSubstrateApiEndpoint,
  useSubstrateApiState,
  useTokenAmount,
  useTokenAmountFromPlanck,
} from '../../../common'
import { MIN_SUBTENSOR_STAKE } from '../atoms/delegates'
import { type Stake } from './useStake'
import type { SubmittableExtrinsic } from '@polkadot/api/types'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import { BigMath } from '@talismn/util'
import { useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

export const useAddStakeForm = (account: Account, stake: Stake, delegate: string) => {
  const [api, [accountInfo]] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryMultiState([['system.account', account.address]])])
  )

  const [input, setInput] = useState('')
  const amount = useTokenAmount(input)

  const tx: SubmittableExtrinsic<any> = useMemo(
    () =>
      api.tx.utility.batchAll([
        (api.tx as any)?.subtensorModule?.addStake?.(delegate, amount.decimalAmount?.planck ?? 0n),
        api.tx.system.remarkWithEvent(`talisman-bittensor`),
      ]),
    [api.tx, delegate, amount.decimalAmount?.planck]
  )

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
    const transferable = BigMath.max(free - untouchableOrEd, 0n)

    return transferable - feeEstimate
  }, [accountInfo.data.free, accountInfo.data.frozen, accountInfo.data.reserved, existentialDeposit, feeEstimate])

  const transferable = useTokenAmountFromPlanck(transferablePlanck)
  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => (stake.totalStaked.decimalAmount?.planck ?? 0n) + (amount.decimalAmount?.planck ?? 0n),
      [amount.decimalAmount?.planck, stake.totalStaked.decimalAmount?.planck]
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

  const ready = isFeeEstimateReady && (amount.decimalAmount?.planck ?? 0n) > 0n && error === undefined

  return {
    input,
    setInput,
    amount,
    transferable,
    resulting,
    extrinsic,
    ready,
    error,
  }
}

export const useUnstakeForm = (stake: Stake, delegate: string) => {
  const api = useRecoilValue(useSubstrateApiState())

  const [input, setInput] = useState('')
  const amount = useTokenAmount(input)

  const tx: SubmittableExtrinsic<any> = useMemo(
    () => (api.tx as any)?.subtensorModule?.removeStake?.(delegate, amount.decimalAmount?.planck ?? 0n),
    [api.tx, delegate, amount.decimalAmount?.planck]
  )
  const extrinsic = useExtrinsic(tx)

  const availablePlanck = useMemo(
    () => stake.stakes?.find(s => s.hotkey === delegate)?.stake ?? 0n,
    [delegate, stake.stakes]
  )
  const available = useTokenAmountFromPlanck(availablePlanck)

  const minimum = useTokenAmount(String(MIN_SUBTENSOR_STAKE))
  const error = useMemo(() => {
    if (input === '') return

    if ((amount.decimalAmount?.planck ?? 0n) > available.decimalAmount.planck) return new Error('Insufficient balance')

    if (
      amount.decimalAmount &&
      available.decimalAmount.planck - amount.decimalAmount.planck > 0n &&
      available.decimalAmount.planck - amount.decimalAmount.planck < (minimum.decimalAmount?.planck ?? 0n)
    ) {
      return new Error(`Need ${minimum.decimalAmount?.toLocaleString?.()} to keep staking`)
    }

    return undefined
  }, [amount.decimalAmount, available.decimalAmount.planck, input, minimum.decimalAmount])

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => BigMath.max(0n, available.decimalAmount?.planck - (amount.decimalAmount?.planck ?? 0n)),
      [amount.decimalAmount?.planck, available.decimalAmount?.planck]
    )
  )

  const ready = (amount.decimalAmount?.planck ?? 0n) > 0n && error === undefined

  return {
    input,
    setInput,
    amount,
    available,
    resulting,
    extrinsic,
    ready,
    error,
  }
}

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
