import { useQueryMulti, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'

export const usePoolUnstakeForm = (account?: string) => {
  const queriesLoadable = useQueryMulti(['nominationPools.minJoinBond', ['nominationPools.poolMembers', account]], {
    enabled: account !== undefined,
  })

  const [input, setAmount] = useTokenAmountState('')

  const minNeededForMembership = useTokenAmountFromAtomics(queriesLoadable.contents[0])

  const available = useTokenAmountFromAtomics(queriesLoadable.valueMaybe()?.[1]?.unwrapOrDefault().points)

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
      return new Error(`Need ${minNeededForMembership.decimalAmount?.toHuman()} to stay in pool`)
    }
  }, [queriesLoadable.state, available.decimalAmount, input.decimalAmount, minNeededForMembership.decimalAmount])

  return { input, available, resulting, setAmount, error, isReady: queriesLoadable.state === 'hasValue' }
}
