import { useChainState, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'

export const usePoolAddForm = (account?: string) => {
  const balancesLoadable = useChainState('derive', 'balances', 'all', [account!], { enabled: account !== undefined })
  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers', [account!], {
    enabled: account !== undefined,
  })

  const [input, setAmount] = useTokenAmountState('')

  const freeBalance = useTokenAmountFromAtomics(balancesLoadable.valueMaybe()?.freeBalance)

  const resulting = useTokenAmountFromAtomics(
    useMemo(
      () =>
        poolMembersLoadable
          .valueMaybe()
          ?.unwrapOrDefault()
          .points.add(input.decimalAmount?.atomics ?? new BN(0)),
      [input.decimalAmount?.atomics, poolMembersLoadable]
    )
  )

  const error = useMemo(() => {
    if (balancesLoadable.state !== 'hasValue') return

    if (freeBalance.decimalAmount !== undefined && input.decimalAmount?.atomics.gt(freeBalance.decimalAmount.atomics)) {
      return new Error('Insufficient balance')
    }
  }, [input.decimalAmount?.atomics, balancesLoadable.state, freeBalance.decimalAmount])

  return {
    input,
    freeBalance,
    resulting,
    setAmount,
    error,
    isReady: balancesLoadable.state === 'hasValue' && poolMembersLoadable.state === 'hasValue',
  }
}
