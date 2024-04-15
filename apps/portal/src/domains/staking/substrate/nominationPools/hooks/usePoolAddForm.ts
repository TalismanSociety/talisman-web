import { useSubstrateApiEndpoint, useTokenAmountFromPlanck, useTokenAmountState } from '@domains/common/hooks'
import { paymentInfoState, useSubstrateApiState } from '@domains/common/recoils'
import { BN } from '@polkadot/util'
import { useDeriveState, useQueryMultiState } from '@talismn/react-polkadot-api'
import { Maybe } from '@util/monads'
import usePrevious from '@util/usePrevious'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.5

export const usePoolAddForm = (action: 'bondExtra' | 'join', account?: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  const apiEndpoint = useSubstrateApiEndpoint()

  const prevAccount = usePrevious(account)

  const balancesLoadable = useRecoilValueLoadable(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useDeriveState('balances', 'all', [account!], { enabled: account !== undefined })
  )

  const queriesLoadable = useRecoilValueLoadable(
    useQueryMultiState([['nominationPools.poolMembers', account], 'nominationPools.minJoinBond'], {
      enabled: account !== undefined,
    })
  )

  // TODO: have hook return extrinsic as well
  const maxSubmittableForFeeEstimation = useMemo(() => {
    switch (action) {
      case 'bondExtra':
        return api.tx.nominationPools.bondExtra({ FreeBalance: balancesLoadable.valueMaybe()?.availableBalance ?? 0 })
      case 'join':
        return api.tx.utility.batchAll([
          api.tx.nominationPools.join(balancesLoadable.valueMaybe()?.availableBalance ?? 0, 0),
          api.tx.nominationPools.setClaimPermission('PermissionlessCompound'),
        ])
    }
  }, [action, api.tx.nominationPools, api.tx.utility, balancesLoadable])

  const paymentInfoLoadable = useRecoilValueLoadable(
    account === undefined || balancesLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : paymentInfoState([
          apiEndpoint,
          // @ts-expect-error
          maxSubmittableForFeeEstimation.method.section,
          // @ts-expect-error
          maxSubmittableForFeeEstimation.method.method,
          account,
          ...maxSubmittableForFeeEstimation.args,
        ])
  )

  const [input, setAmount] = useTokenAmountState('')

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

  const resulting = useTokenAmountFromPlanck(
    useMemo(
      () =>
        Maybe.of(queriesLoadable.valueMaybe()?.[0]?.unwrapOrDefault().points.toBigInt()).mapOrUndefined(
          x => x + (input.decimalAmount?.planck ?? 0n)
        ),
      [input.decimalAmount?.planck, queriesLoadable]
    )
  )

  const minimum = useTokenAmountFromPlanck(queriesLoadable.valueMaybe()?.[1])

  const error = useMemo(() => {
    if (balancesLoadable.state !== 'hasValue') return

    if (input.amount.trim() === '') return

    if (
      availableBalance.decimalAmount !== undefined &&
      input.decimalAmount !== undefined &&
      input.decimalAmount.planck > availableBalance.decimalAmount.planck
    ) {
      return new Error('Insufficient balance')
    }

    if (
      action === 'join' &&
      minimum.decimalAmount !== undefined &&
      input.decimalAmount !== undefined &&
      input.decimalAmount.planck < minimum.decimalAmount.planck
    ) {
      return new Error(`Minimum ${minimum.decimalAmount.toHuman()} needed`)
    }

    return undefined
  }, [
    action,
    availableBalance.decimalAmount,
    balancesLoadable.state,
    input.amount,
    input.decimalAmount,
    minimum.decimalAmount,
  ])

  const [searchParams] = useSearchParams()
  const defaultAmount = useMemo(() => searchParams.get('amount'), [searchParams])

  useEffect(() => {
    if (account !== prevAccount) {
      setAmount(defaultAmount ?? '')
    }
  }, [account, defaultAmount, prevAccount, setAmount])

  useEffect(() => {
    //
    // When an `amount` is prefilled via the querystring variable `amount`, we should
    // use either the qs `amount` or the user's `available` amount, whichever is smaller
    //
    const amount = input.amount
    const amountDec = input.decimalAmount?.toNumber()
    const available = availableBalance.decimalAmount?.toNumber()

    if (amountDec === undefined || available === undefined) return
    if (amount !== defaultAmount) return
    if (available >= amountDec) return

    setAmount(available.toString())
  }, [availableBalance.decimalAmount, defaultAmount, input.amount, input.decimalAmount, setAmount])

  return {
    input,
    availableBalance,
    resulting,
    setAmount,
    error,
    isReady: balancesLoadable.state === 'hasValue' && queriesLoadable.state === 'hasValue',
  }
}
