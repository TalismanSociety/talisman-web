import { apiState } from '@domains/chains/recoils'
import { useChainState, useTokenAmount, useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import { paymentInfoState } from '@domains/common/recoils'
import { BN } from '@polkadot/util'
import usePrevious from '@util/usePrevious'
import { useEffect, useMemo } from 'react'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.25

export const usePoolAddForm = (account?: string) => {
  const api = useRecoilValue(apiState)

  const prevAccount = usePrevious(account)

  const balancesLoadable = useChainState('derive', 'balances', 'all', [account!], { enabled: account !== undefined })
  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers', [account!], {
    enabled: account !== undefined,
  })

  // TODO: using estimated fee for adding to existing pool for now
  const paymentInfoLoadable = useRecoilValueLoadable(
    account === undefined || balancesLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : paymentInfoState([
          'nominationPools',
          'bondExtra',
          account,
          { FreeBalance: balancesLoadable.contents.availableBalance },
        ])
  )

  const [input, setAmount] = useTokenAmountState('')

  const oneToken = useTokenAmount('1')
  const availableBalance = useTokenAmountFromAtomics(
    paymentInfoLoadable.state !== 'hasValue' || paymentInfoLoadable.contents === undefined
      ? undefined
      : balancesLoadable
          .valueMaybe()
          ?.availableBalance.lt(
            api.consts.balances.existentialDeposit.add(
              paymentInfoLoadable.contents.partialFee.muln(1 + ESTIMATED_FEE_MARGIN_OF_ERROR)
            )
          )
      ? new BN(0)
      : balancesLoadable
          .valueMaybe()
          ?.availableBalance.sub(api.consts.balances.existentialDeposit)
          .sub(paymentInfoLoadable.contents.partialFee.muln(1 + ESTIMATED_FEE_MARGIN_OF_ERROR))
  )

  const minAmount = useTokenAmountFromAtomics(
    useMemo(
      () =>
        availableBalance.decimalAmount === undefined || oneToken.decimalAmount === undefined
          ? undefined
          : BN.min(availableBalance.decimalAmount.atomics, oneToken.decimalAmount.atomics),
      [availableBalance, oneToken.decimalAmount]
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

    if (
      availableBalance.decimalAmount !== undefined &&
      input.decimalAmount?.atomics.gt(availableBalance.decimalAmount.atomics)
    ) {
      return new Error('Insufficient balance')
    }
  }, [input.decimalAmount?.atomics, balancesLoadable.state, availableBalance.decimalAmount])

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
    availableBalance,
    resulting,
    setAmount,
    error,
    isReady: balancesLoadable.state === 'hasValue' && poolMembersLoadable.state === 'hasValue',
  }
}
