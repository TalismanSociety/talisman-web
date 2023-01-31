import { apiState } from '@domains/chains/recoils'
import {
  useChainState,
  useQueryMulti,
  useTokenAmount,
  useTokenAmountFromPlanck,
  useTokenAmountState,
} from '@domains/common/hooks'
import { paymentInfoState } from '@domains/common/recoils'
import { BN } from '@polkadot/util'
import usePrevious from '@util/usePrevious'
import { useEffect, useMemo } from 'react'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.25

export const usePoolAddForm = (action: 'bondExtra' | 'join', account?: string) => {
  const api = useRecoilValue(apiState)

  const prevAccount = usePrevious(account)

  const balancesLoadable = useChainState('derive', 'balances', 'all', [account!], { enabled: account !== undefined })

  const queriesLoadable = useQueryMulti([['nominationPools.poolMembers', account], 'nominationPools.minJoinBond'], {
    enabled: account !== undefined,
  })

  // TODO: using estimated fee for adding to existing pool for now
  const paymentInfoLoadable = useRecoilValueLoadable(
    account === undefined || balancesLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : action === 'bondExtra'
      ? paymentInfoState([
          'nominationPools',
          'bondExtra',
          account,
          { FreeBalance: balancesLoadable.contents.availableBalance },
        ])
      : paymentInfoState(['nominationPools', 'join', account, balancesLoadable.contents.availableBalance, 0])
  )

  const [input, setAmount] = useTokenAmountState('')

  const oneToken = useTokenAmount('1')
  const availableBalance = useTokenAmountFromPlanck(
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

  const initialAmount = useTokenAmountFromPlanck(
    useMemo(
      () =>
        availableBalance.decimalAmount === undefined || oneToken.decimalAmount === undefined
          ? undefined
          : BN.min(availableBalance.decimalAmount.planck, oneToken.decimalAmount.planck),
      [availableBalance, oneToken.decimalAmount]
    )
  )

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () =>
        queriesLoadable
          .valueMaybe()?.[0]
          ?.unwrapOrDefault()
          .points.add(input.decimalAmount?.planck ?? new BN(0)),
      [input.decimalAmount?.planck, queriesLoadable]
    )
  )

  const minimum = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[1])

  const error = useMemo(() => {
    if (balancesLoadable.state !== 'hasValue') return

    if (input.amount.trim() === '') return

    if (
      availableBalance.decimalAmount !== undefined &&
      input.decimalAmount?.planck.gt(availableBalance.decimalAmount.planck)
    ) {
      return new Error('Insufficient balance')
    }

    if (
      action === 'join' &&
      minimum.decimalAmount !== undefined &&
      input.decimalAmount?.planck.lt(minimum.decimalAmount.planck)
    ) {
      return new Error(`Minimum ${minimum.decimalAmount.toHuman()} needed`)
    }
  }, [
    balancesLoadable.state,
    input.amount,
    input.decimalAmount?.planck,
    availableBalance.decimalAmount,
    action,
    minimum.decimalAmount,
  ])

  useEffect(() => {
    if (account !== prevAccount) {
      setAmount('')
    }
  }, [account, prevAccount, setAmount])

  useEffect(
    () => {
      if (
        (input.amount === '' || account !== prevAccount) &&
        initialAmount.decimalAmount !== undefined &&
        !initialAmount.decimalAmount.planck.isZero()
      ) {
        setAmount(initialAmount.decimalAmount.toString())
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialAmount.decimalAmount]
  )

  return {
    input,
    availableBalance,
    resulting,
    setAmount,
    error,
    isReady: balancesLoadable.state === 'hasValue' && queriesLoadable.state === 'hasValue',
  }
}
