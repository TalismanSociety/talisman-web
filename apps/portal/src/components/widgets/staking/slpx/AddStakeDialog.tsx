import { useEffect } from 'react'

import type { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxAddStakeDialog } from '@/components/recipes/AddStakeDialog'
import { Account } from '@/domains/accounts/recoils'
import { useMintForm } from '@/domains/staking/slpx/core'
import { Maybe } from '@/util/monads'

type AddStakeDialogProps = {
  account: Account
  slpxPair: SlpxPair
  onRequestDismiss: () => unknown
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  const {
    input: { amount, localizedFiatAmount },
    setAmount,
    newDestTokenAmount: newAmount,
    available,
    approvalNeeded,
    approve,
    approveTransaction,
    mint,
    rate,
    ready,
    error,
  } = useMintForm(props.account, props.slpxPair)

  useEffect(() => {
    if (mint.status === 'success' || mint.status === 'error') {
      props.onRequestDismiss()
    }
  }, [mint.status, props])

  return (
    <SlpxAddStakeDialog
      confirmState={
        !ready
          ? 'disabled'
          : mint.isPending || approve.isPending || approveTransaction.isLoading
          ? 'pending'
          : undefined
      }
      approvalNeeded={approvalNeeded}
      open
      onDismiss={props.onRequestDismiss}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toLocaleString() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableToStake={available?.toLocaleString() ?? '...'}
      rate={Maybe.of(rate).mapOr(
        '...',
        rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
      )}
      onConfirm={async () => {
        if (approvalNeeded) {
          await approve.writeContractAsync()
        } else {
          await mint.writeContractAsync()
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

export default AddStakeDialog
