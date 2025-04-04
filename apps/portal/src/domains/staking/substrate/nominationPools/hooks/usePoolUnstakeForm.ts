import { useMemo } from 'react'

import { useExtrinsic } from '@/domains/common/hooks/useExtrinsic'
import { useQueryMulti } from '@/domains/common/hooks/useQueryMulti'
import { useTokenAmountFromPlanck, useTokenAmountState } from '@/domains/common/hooks/useTokenAmount'

export const usePoolUnstakeForm = (account?: string) => {
  const unbondExtrinsic = useExtrinsic('nominationPools', 'unbond')

  const queriesLoadable = useQueryMulti(['nominationPools.minJoinBond', ['nominationPools.poolMembers', account]], {
    enabled: account !== undefined,
  })

  const [input, setAmount] = useTokenAmountState('')

  const minNeededForMembership = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[0])

  const available = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[1]?.unwrapOrDefault().points)

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () =>
        available.decimalAmount === undefined || input.decimalAmount === undefined
          ? undefined
          : available.decimalAmount.planck - input.decimalAmount.planck,
      [available.decimalAmount, input.decimalAmount]
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
      if (
        available.decimalAmount !== undefined &&
        input.decimalAmount !== undefined &&
        input.decimalAmount.planck > available.decimalAmount.planck
      ) {
        return new Error('Insufficient balance')
      }

      if (
        available.decimalAmount !== undefined &&
        input.decimalAmount !== undefined &&
        input.decimalAmount.planck !== available.decimalAmount.planck &&
        minNeededForMembership.decimalAmount !== undefined &&
        available.decimalAmount.planck - input.decimalAmount.planck < minNeededForMembership.decimalAmount.planck
      ) {
        return new Error(`Need ${minNeededForMembership.decimalAmount?.toLocaleString()} to stay in pool`)
      }
    }

    return undefined
  }, [
    available.decimalAmount,
    input.decimalAmount,
    isLeaving,
    minNeededForMembership.decimalAmount,
    queriesLoadable.state,
  ])

  return {
    extrinsic: {
      ...unbondExtrinsic,
      unbondMax: async (account: string, memberAccount: string) => {
        const pool = queriesLoadable.valueMaybe()?.[1]

        if (pool === undefined) {
          throw new Error('Extrinsic not ready yet')
        }

        return await unbondExtrinsic.signAndSend(account, memberAccount, pool.unwrapOrDefault().points)
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
