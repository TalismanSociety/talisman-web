import { useExtrinsic, useQueryMulti, useTokenAmountFromPlanck, useTokenAmountState } from '@domains/common/hooks'
import useExtrinsicBatch from '@domains/common/hooks/useExtrinsicBatch'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'

export const useValidatorUnstakeForm = (account?: string) => {
  const unbondExtrinsic = useExtrinsic('staking', 'unbond')
  const unbondAllExtrinsic = useExtrinsicBatch(['staking.chill', 'staking.unbond'])

  const queriesLoadable = useQueryMulti(['staking.minNominatorBond', ['staking.ledger', account]], {
    enabled: account !== undefined,
  })

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
      state: unbondExtrinsic.state === 'loading' || unbondAllExtrinsic.state === 'loading' ? 'loading' : 'idle',
      unbondAll: async (account: string) => {
        const stake = queriesLoadable.valueMaybe()?.[1]

        if (stake === undefined) {
          throw new Error('Extrinsic not ready yet')
        }

        return await unbondAllExtrinsic.signAndSend(account, [
          [],
          // Internal @polkadot type error
          [queriesLoadable.valueMaybe()?.[1].unwrapOrDefault().active ?? 0],
        ])
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
