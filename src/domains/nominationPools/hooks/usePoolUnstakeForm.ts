import { useChainState, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import { useMemo } from 'react'

export const usePoolUnstakeForm = (account?: string) => {
  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers', [account!], {
    enabled: account !== undefined,
  })

  const [input, setAmount] = useTokenAmountState('')

  const available = useTokenAmountFromAtomics(poolMembersLoadable.valueMaybe()?.unwrapOrDefault().points)

  const resulting = useTokenAmountFromAtomics(
    useMemo(
      () => available.decimalAmount?.atomics.sub(input.decimalAmount?.atomics ?? new BN(0)),
      [available.decimalAmount?.atomics, input.decimalAmount?.atomics]
    )
  )

  const error = useMemo(() => {
    if (poolMembersLoadable.state !== 'hasValue') return

    if (available.decimalAmount !== undefined && input.decimalAmount?.atomics.gt(available.decimalAmount.atomics)) {
      return new Error('Insufficient balance')
    }
  }, [poolMembersLoadable.state, available.decimalAmount, input.decimalAmount?.atomics])

  return { input, available, resulting, setAmount, error, isReady: poolMembersLoadable.state === 'hasValue' }
}
