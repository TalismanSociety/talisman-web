import { SlpxAddStakeDialog } from '@components/recipes/AddStakeDialog'
import { type Account } from '@domains/accounts'
import { useMintForm } from '@domains/staking/slpx/core'
import type { SlpxPair } from '@domains/staking/slpx/types'
import { Maybe } from '@util/monads'
import { useEffect } from 'react'

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
      confirmState={!ready ? 'disabled' : mint.isLoading ? 'pending' : undefined}
      open
      onDismiss={props.onRequestDismiss}
      amount={amount}
      fiatAmount={localizedFiatAmount ?? '...'}
      newAmount={newAmount?.toHuman() ?? '...'}
      newFiatAmount={null}
      onChangeAmount={setAmount}
      availableToStake={available?.toHuman() ?? '...'}
      rate={Maybe.of(rate).mapOr(
        '...',
        rate => `1 ${props.slpxPair.nativeToken.symbol} = ${rate.toLocaleString()} ${props.slpxPair.vToken.symbol}`
      )}
      onConfirm={async () => {
        await mint.writeAsync()
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
