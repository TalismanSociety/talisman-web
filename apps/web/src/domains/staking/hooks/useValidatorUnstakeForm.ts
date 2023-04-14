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

  const error = useMemo(() => {
    if (queriesLoadable.state !== 'hasValue') return

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
  }, [queriesLoadable.state, available.decimalAmount, input.decimalAmount, minNeededForMembership.decimalAmount])

  return {
    extrinsic: {
      ...unbondExtrinsic,
      // TODO: clean up this dirty hack
      // maybe create a hook or function to combine status of multiple distinct extrinsic
      state: unbondExtrinsic.state === 'loading' || unbondAllExtrinsic.state === 'loading' ? 'loading' : 'idle',
      unbondAll: (account: string) => {
        const stake = queriesLoadable.valueMaybe()?.[1]

        if (stake === undefined) {
          throw new Error('Extrinsic not ready yet')
        }

        return unbondAllExtrinsic.signAndSend(account, [
          [],
          // @ts-ignore
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
    isReady: queriesLoadable.state === 'hasValue',
  }
}
