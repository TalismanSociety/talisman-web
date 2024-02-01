import { useExtrinsic, useQueryMulti, useTokenAmountFromPlanck, useTokenAmountState } from '@domains/common/hooks'
import type { ApiPromise } from '@polkadot/api'
import { BN } from '@polkadot/util'
import { useCallback, useMemo } from 'react'

export const useValidatorUnstakeForm = (account?: string) => {
  const queriesLoadable = useQueryMulti(['staking.minNominatorBond', ['staking.ledger', account]], {
    enabled: account !== undefined,
  })
  const stake = useMemo(() => queriesLoadable.valueMaybe()?.[1], [queriesLoadable])
  const unbondExtrinsic = useExtrinsic('staking', 'unbond')
  const unbondAllExtrinsic = useExtrinsic(
    useCallback(
      (api: ApiPromise) =>
        api.tx.utility.batchAll([api.tx.staking.chill(), api.tx.staking.unbond(stake?.unwrapOrDefault().active ?? 0)]),
      [stake]
    )
  )

  const [input, setAmount] = useTokenAmountState('')

  const minNeededForMembership = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[0])

  const available = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[1]?.unwrapOrDefault().active.unwrap())

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () => available.decimalAmount?.planck.sub(input.decimalAmount?.planck ?? new BN(0)),
      [available.decimalAmount?.planck, input.decimalAmount?.planck]
    )
  )

  const isLeaving = useMemo(
    () =>
      input.decimalAmount !== undefined &&
      available.decimalAmount !== undefined &&
      input.decimalAmount.toString() === input.amount &&
      input.decimalAmount.toString() === available.decimalAmount.toString(),
    [available.decimalAmount, input.amount, input.decimalAmount]
  )

  const error = useMemo(() => {
    if (queriesLoadable.state !== 'hasValue') return

    if (!isLeaving) {
      if (available.decimalAmount !== undefined && input.decimalAmount?.planck.gt(available.decimalAmount.planck)) {
        return new Error('Insufficient balance')
      }

      if (
        available.decimalAmount !== undefined &&
        input.decimalAmount !== undefined &&
        !input.decimalAmount.planck.eq(available.decimalAmount.planck) &&
        minNeededForMembership.decimalAmount !== undefined &&
        available.decimalAmount.planck.sub(input.decimalAmount.planck).lt(minNeededForMembership.decimalAmount.planck)
      ) {
        return new Error(`Need ${minNeededForMembership.decimalAmount?.toHuman()} to stay active`)
      }
    }

    return undefined
  }, [
    queriesLoadable.state,
    isLeaving,
    available.decimalAmount,
    input.decimalAmount,
    minNeededForMembership.decimalAmount,
  ])

  return {
    extrinsic: {
      ...unbondExtrinsic,
      // TODO: clean up this dirty hack
      // maybe create a hook or function to combine status of multiple distinct extrinsic
      state: (unbondExtrinsic.state === 'loading' || unbondAllExtrinsic.state === 'loading'
        ? ('loading' as const)
        : ('idle' as const)) as any,
      unbondAll: async (account: string) => {
        if (stake === undefined) {
          throw new Error('Extrinsic not ready yet')
        }

        return await unbondAllExtrinsic.signAndSend(account)
      },
    },
    input,
    available,
    resulting,
    setAmount,
    error,
    isLeaving,
    isReady: queriesLoadable.state === 'hasValue',
  }
}
