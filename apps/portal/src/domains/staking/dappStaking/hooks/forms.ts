import type { Account } from '../../../accounts'
import {
  paymentInfoState,
  useExtrinsic,
  useSubstrateApiEndpoint,
  useSubstrateApiState,
  useTokenAmount,
  useTokenAmountFromPlanck,
} from '../../../common'
import type { ApiPromise } from '@polkadot/api'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { BigIntMath } from '@talismn/math'
import { useQueryMultiState, useQueryState } from '@talismn/react-polkadot-api'
import { Maybe } from '../../../../util/monads'
import BN from 'bn.js'
import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'
import { getAllRewardsClaimExtrinsics, type Stake } from '.'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.5

export const useAddStakeForm = (
  account: Account,
  stake: Stake,
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
) => {
  const [amount, setAmount] = useState('')
  const deferredAmount = useDeferredValue(amount)
  const input = useTokenAmount(deferredAmount)
  const inTransition = amount !== deferredAmount

  const [api, [accountInfo, activeProtocol, stakerInfo]] = useRecoilValue(
    waitForAll([
      useSubstrateApiState(),
      useQueryMultiState([
        ['system.account', account.address],
        ['dappStaking.activeProtocolState'],
        ['dappStaking.stakerInfo', [account.address, dapp]],
      ]),
    ])
  )

  const transferable = useMemo(
    () => BigIntMath.max(0n, accountInfo.data.free.toBigInt() - accountInfo.data.frozen.toBigInt()),
    [accountInfo.data.free, accountInfo.data.frozen]
  )
  const lockedAvailableForStake = useMemo(
    () => BigIntMath.max(0n, stake.ledger.locked.unwrap().toBigInt() - (stake.totalStaked.decimalAmount?.planck ?? 0n)),
    [stake.ledger.locked, stake.totalStaked]
  )

  const availableBeforeFee = useTokenAmountFromPlanck(
    useMemo(
      () =>
        BigIntMath.max(0n, transferable - api.consts.balances.existentialDeposit.toBigInt() + lockedAvailableForStake),
      [api.consts.balances.existentialDeposit, lockedAvailableForStake, transferable]
    )
  )

  const maxSubmittable = useMemo(() => {
    const amountToLock = BigIntMath.max(availableBeforeFee.decimalAmount.planck - lockedAvailableForStake, 0n)

    if (amountToLock === 0n) {
      return api.tx.dappStaking.stake(dapp, availableBeforeFee.decimalAmount.planck)
    }

    return api.tx.utility.batchAll([
      ...getAllRewardsClaimExtrinsics(api, stake),
      api.tx.dappStaking.lock(amountToLock ?? 0n),
      api.tx.dappStaking.stake(dapp, availableBeforeFee.decimalAmount.planck),
    ])
  }, [api, availableBeforeFee.decimalAmount.planck, dapp, lockedAvailableForStake, stake])

  // This will change after staking n will retrigger suspense
  // if we use `useRecoilValue`
  const paymentInfoLoadable = useRecoilValueLoadable(
    paymentInfoState([
      useSubstrateApiEndpoint(),
      // @ts-expect-error
      maxSubmittable.method.section,
      // @ts-expect-error
      maxSubmittable.method.method,
      account.address,
      ...maxSubmittable.args,
    ])
  )

  const available = useTokenAmountFromPlanck(
    useMemo(
      () =>
        BigIntMath.max(
          0n,
          availableBeforeFee.decimalAmount.planck -
            BigInt(
              new BN(paymentInfoLoadable.valueMaybe()?.partialFee.muln(ESTIMATED_FEE_MARGIN_OF_ERROR) ?? 0).toString()
            )
        ),
      [availableBeforeFee.decimalAmount.planck, paymentInfoLoadable]
    )
  )

  const minimum = useTokenAmountFromPlanck(api.consts.dappStaking.minimumStakeAmount)

  const maxStakeEntriesReached = useMemo(
    () => stake.ledger.contractStakeCount.unwrap().gte(api.consts.dappStaking.maxNumberOfStakedContracts),
    [api.consts.dappStaking.maxNumberOfStakedContracts, stake.ledger.contractStakeCount]
  )

  const maxStakedDappsReached = useMemo(
    () => stake.dapps.length >= api.consts.dappStaking.maxNumberOfStakedContracts.toBigInt(),
    [api.consts.dappStaking.maxNumberOfStakedContracts, stake.dapps.length]
  )

  const canCleanUpEntriesToMakeSpace = useMemo(
    () => !maxStakedDappsReached || stakerInfo.isSome,
    [maxStakedDappsReached, stakerInfo.isSome]
  )

  const error = useMemo(() => {
    if (deferredAmount.trim() === '' || inTransition) return

    if (
      activeProtocol.periodInfo.subperiod.type === 'BuildAndEarn' &&
      activeProtocol.periodInfo.nextSubperiodStartEra.toBigInt() <= activeProtocol.era.toBigInt() + 1n
    ) {
      return new Error('Not possible to stake in the last era of a period')
    }

    if (maxStakeEntriesReached && !canCleanUpEntriesToMakeSpace) {
      return new Error('Too many staked contracts for the account')
    }

    if (input.decimalAmount !== undefined && input.decimalAmount.planck > available.decimalAmount.planck) {
      return new Error('Insufficient balance')
    }

    if (input.decimalAmount !== undefined && input.decimalAmount.planck < minimum.decimalAmount.planck) {
      return new Error(`Minimum ${minimum.decimalAmount.toLocaleString()} needed`)
    }

    return undefined
  }, [
    activeProtocol.era,
    activeProtocol.periodInfo.nextSubperiodStartEra,
    activeProtocol.periodInfo.subperiod.type,
    available.decimalAmount.planck,
    canCleanUpEntriesToMakeSpace,
    deferredAmount,
    inTransition,
    input.decimalAmount,
    maxStakeEntriesReached,
    minimum.decimalAmount,
  ])

  return {
    ready:
      paymentInfoLoadable.state === 'hasValue' &&
      deferredAmount.trim() !== '' &&
      input.decimalAmount !== undefined &&
      input.decimalAmount.planck !== 0n &&
      error === undefined &&
      !inTransition,
    input: { ...input, amount },
    setAmount,
    available,
    resulting: useTokenAmountFromPlanck(
      useMemo(
        () =>
          inTransition
            ? undefined
            : stakerInfo.unwrapOrDefault().staked.voting.unwrap().toBigInt() +
              stakerInfo.unwrapOrDefault().staked.buildAndEarn.unwrap().toBigInt() +
              (input.decimalAmount?.planck ?? 0n),
        [inTransition, input.decimalAmount?.planck, stakerInfo]
      )
    ),
    error,
    extrinsic: useExtrinsic(
      useCallback(
        (api: ApiPromise) => {
          const amountToLock = Maybe.of(input.decimalAmount?.planck).mapOrUndefined(x =>
            BigIntMath.max(x - lockedAvailableForStake, 0n)
          )

          const exs = [
            ...getAllRewardsClaimExtrinsics(api, stake),
            ...(amountToLock === undefined || amountToLock === 0n ? [] : [api.tx.dappStaking.lock(amountToLock ?? 0)]),
            ...(maxStakeEntriesReached && canCleanUpEntriesToMakeSpace
              ? [api.tx.dappStaking.cleanupExpiredEntries()]
              : []),
            api.tx.dappStaking.stake(dapp, input.decimalAmount?.planck ?? 0),
          ]

          return exs.length <= 1 ? exs.at(0) : api.tx.utility.batchAll(exs)
        },
        [
          canCleanUpEntriesToMakeSpace,
          dapp,
          input.decimalAmount?.planck,
          lockedAvailableForStake,
          maxStakeEntriesReached,
          stake,
        ]
      )
    ),
  }
}

export const useUnstakeForm = (
  account: Account,
  stake: Stake,
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
) => {
  const [amount, setAmount] = useState('')
  const deferredAmount = useDeferredValue(amount)
  const input = useTokenAmount(deferredAmount)
  const inTransition = amount !== deferredAmount

  const [api, stakerInfo] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useQueryState('dappStaking', 'stakerInfo', [account.address, dapp])])
  )

  const extrinsic = useExtrinsic(
    useCallback(
      (api: ApiPromise) =>
        api.tx.utility.batchAll([
          ...getAllRewardsClaimExtrinsics(api, stake),
          api.tx.dappStaking.unstake(dapp, input.decimalAmount?.planck ?? 0),
          api.tx.dappStaking.unlock(input.decimalAmount?.planck ?? 0),
        ]),
      [dapp, input.decimalAmount?.planck, stake]
    )
  )

  const available = useTokenAmountFromPlanck(
    useMemo(
      () =>
        stakerInfo
          .unwrapOrDefault()
          .staked.voting.unwrap()
          .add(stakerInfo.unwrapOrDefault().staked.buildAndEarn.unwrap()),
      [stakerInfo]
    )
  )

  const minimum = useTokenAmountFromPlanck(api.consts.dappStaking.minimumStakeAmount)

  const error = useMemo(() => {
    if (amount.trim() === '' || inTransition) return

    if (input.decimalAmount !== undefined && input.decimalAmount.planck > available.decimalAmount.planck) {
      return new Error('Insufficient balance')
    }

    if (
      input.decimalAmount !== undefined &&
      available.decimalAmount.planck - input.decimalAmount.planck > 0n &&
      available.decimalAmount.planck - input.decimalAmount.planck < minimum.decimalAmount.planck
    ) {
      return new Error(`Need ${minimum.decimalAmount.toLocaleString()} to keep staking`)
    }

    return undefined
  }, [amount, available.decimalAmount.planck, inTransition, input.decimalAmount, minimum.decimalAmount])

  return {
    ready:
      deferredAmount.trim() !== '' &&
      input.decimalAmount !== undefined &&
      input.decimalAmount.planck !== 0n &&
      error === undefined &&
      !inTransition,
    input: { ...input, amount },
    setAmount,
    available,
    resulting: useTokenAmountFromPlanck(
      useMemo(
        () =>
          BigIntMath.max(
            0n,
            stakerInfo.unwrapOrDefault().staked.voting.unwrap().toBigInt() +
              stakerInfo.unwrapOrDefault().staked.buildAndEarn.unwrap().toBigInt() -
              (input.decimalAmount?.planck ?? 0n)
          ),
        [input.decimalAmount?.planck, stakerInfo]
      )
    ),
    error,
    extrinsic,
  }
}
