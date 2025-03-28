import { Suspense, useEffect } from 'react'

import { SlpxUnstakeDialog } from '@/components/recipes/UnstakeDialog'
import { Account } from '@/domains/accounts/recoils'
import { useRedeemForm } from '@/domains/staking/slpx/core'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { Maybe } from '@/util/monads'

import UnlockDuration from './UnlockDuration'

type UnstakeDialogProps = {
  account?: Account
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newOriginTokenAmount: newAmount,
    available,
    approve,
    approveTransaction,
    approvalNeeded,
    redeem,
    rate,
    ready,
    error,
  } = useRedeemForm(props.account, props.slpxPair)

  useEffect(() => {
    if (redeem.status === 'success' || redeem.status === 'error') {
      props.onRequestDismiss()
    }
  }, [props, redeem.status])

  return (
    <SlpxUnstakeDialog
      confirmState={
        !ready
          ? 'disabled'
          : redeem.isPending || approve.isPending || approveTransaction.isLoading
          ? 'pending'
          : undefined
      }
      open
      onDismiss={props.onRequestDismiss}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableAmount={available?.toLocaleString() ?? '...'}
      lockDuration={
        <Suspense fallback="...">
          <UnlockDuration slpxPair={props.slpxPair} />
        </Suspense>
      }
      rate={Maybe.of(rate).mapOr(
        '...',
        rate => `1 ${props.slpxPair.vToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.nativeToken.symbol}`
      )}
      approvalNeeded={approvalNeeded}
      onConfirm={async () => {
        if (approvalNeeded) {
          await approve.writeContractAsync()
        } else {
          await redeem.writeContractAsync()
        }
      }}
      onRequestMaxAmount={() => {
        if (available !== undefined) {
          setAmount(available.toString())
        }
      }}
      isError={error !== undefined}
      inputSupportingText={error?.message}
    />
  )
}

export default UnstakeDialog
