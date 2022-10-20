import { useChainState, useTokenAmount, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import { BN } from '@polkadot/util'
import usePrevious from '@util/usePrevious'
import { useEffect, useMemo } from 'react'

export const usePoolAddForm = (account?: string) => {
  const prevAccount = usePrevious(account)

  const balancesLoadable = useChainState('derive', 'balances', 'all', [account!], { enabled: account !== undefined })
  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers', [account!], {
    enabled: account !== undefined,
  })

  const [input, setAmount] = useTokenAmountState('')

  const oneToken = useTokenAmount('1')
  const freeBalance = useTokenAmountFromAtomics(balancesLoadable.valueMaybe()?.freeBalance)
  const minAmount = useTokenAmountFromAtomics(
    useMemo(
      () =>
        balancesLoadable.state !== 'hasValue' || oneToken.decimalAmount === undefined
          ? undefined
          : BN.min(balancesLoadable.contents.freeBalance, oneToken.decimalAmount.atomics),
      [balancesLoadable.contents.freeBalance, balancesLoadable.state, oneToken.decimalAmount]
    )
  )

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

  useEffect(() => {
    if (account !== prevAccount) {
      setAmount('')
    }
  }, [account, prevAccount, setAmount])

  useEffect(
    () => {
      if ((input.amount === '' || account !== prevAccount) && minAmount.decimalAmount !== undefined) {
        setAmount(minAmount.decimalAmount.toString())
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [minAmount.decimalAmount]
  )

  return {
    input,
    freeBalance,
    resulting,
    setAmount,
    error,
    isReady: balancesLoadable.state === 'hasValue' && poolMembersLoadable.state === 'hasValue',
  }
}
