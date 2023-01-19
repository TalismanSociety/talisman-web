import { useExtrinsic, useQueryMulti, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
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

  const minNeededForMembership = useTokenAmountFromAtomics(queriesLoadable.contents[0])

  const available = useTokenAmountFromAtomics(queriesLoadable.valueMaybe()?.[1]?.unwrapOrDefault().active.unwrap())

  const resulting = useTokenAmountFromAtomics(
    useMemo(
      () => available.decimalAmount?.atomics.sub(input.decimalAmount?.atomics ?? new BN(0)),
      [available.decimalAmount?.atomics, input.decimalAmount?.atomics]
    )
  )

  const error = useMemo(() => {
    if (queriesLoadable.state !== 'hasValue') return

    if (available.decimalAmount !== undefined && input.decimalAmount?.atomics.gt(available.decimalAmount.atomics)) {
      return new Error('Insufficient balance')
    }

    if (
      available.decimalAmount !== undefined &&
      input.decimalAmount !== undefined &&
      !input.decimalAmount.atomics.eq(available.decimalAmount.atomics) &&
      minNeededForMembership.decimalAmount !== undefined &&
      available.decimalAmount.atomics.sub(input.decimalAmount.atomics).lt(minNeededForMembership.decimalAmount.atomics)
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
