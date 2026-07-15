import { BN } from '@polkadot/util'
import { useQueryMultiState } from '@talismn/react-polkadot-api'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { constSelector, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { useSubstrateApiEndpoint } from '@/domains/common/hooks/useSubstrateApiEndpoint'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { useTokenAmountFromPlanck, useTokenAmountState } from '@/domains/common/hooks/useTokenAmount'
import { paymentInfoState } from '@/domains/common/recoils'
import { Maybe } from '@/util/monads'
import usePrevious from '@/util/usePrevious'

const ESTIMATED_FEE_MARGIN_OF_ERROR = 0.5

export const usePoolAddForm = (action: 'bondExtra' | 'join', account?: string) => {
  const api = useRecoilValue(useSubstrateApiState())
  const apiEndpoint = useSubstrateApiEndpoint()

  const prevAccount = usePrevious(account)

  const queriesLoadable = useRecoilValueLoadable(
    useQueryMultiState(
      [['nominationPools.poolMembers', account], 'nominationPools.minJoinBond', ['system.account', account]],
      { enabled: account !== undefined }
    )
  )

  const balancesReady = queriesLoadable.state === 'hasValue'

  // Available (transferable) balance derived from `system.account` instead of the `balances.all`
  // derive — the derive throws "Balance: Negative number passed to unsigned type" on Asset Hub
  // chains (post-migration frozen/holds model), which left the stake form permanently not-ready.
  const availableBalanceBn = useMemo(() => {
    const accountInfo = queriesLoadable.valueMaybe()?.[2]
    if (accountInfo === undefined) return undefined
    const data = accountInfo.data as {
      free: { toBn: () => BN }
      frozen?: { toBn: () => BN }
      miscFrozen?: { toBn: () => BN }
    }
    const frozen = (data.frozen ?? data.miscFrozen)?.toBn() ?? new BN(0)
    return BN.max(data.free.toBn().sub(frozen), new BN(0))
  }, [queriesLoadable])

  // TODO: have hook return extrinsic as well
  const maxSubmittableForFeeEstimation = useMemo(() => {
    switch (action) {
      case 'bondExtra':
        return api.tx.nominationPools.bondExtra({ FreeBalance: availableBalanceBn ?? 0 })
      case 'join':
        return api.tx.utility.batchAll([
          api.tx.nominationPools.join(availableBalanceBn ?? 0, 0),
          api.tx.nominationPools.setClaimPermission('PermissionlessCompound'),
        ])
    }
  }, [action, api.tx.nominationPools, api.tx.utility, availableBalanceBn])

  const paymentInfoLoadable = useRecoilValueLoadable(
    account === undefined || !balancesReady
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
      : availableBalanceBn?.lt(
          api.consts.balances.existentialDeposit.add(
            paymentInfoLoadable.contents.partialFee.muln(1 + ESTIMATED_FEE_MARGIN_OF_ERROR)
          )
        )
      ? new BN(0)
      : availableBalanceBn
          ?.sub(api.consts.balances.existentialDeposit)
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
    if (!balancesReady) return

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
      return new Error(`Minimum ${minimum.decimalAmount.toLocaleString()} needed`)
    }

    return undefined
  }, [action, availableBalance.decimalAmount, balancesReady, input.amount, input.decimalAmount, minimum.decimalAmount])

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
    isReady: queriesLoadable.state === 'hasValue',
  }
}
