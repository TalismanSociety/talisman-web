import type { Account } from '../../../../domains/accounts'
import { useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { useAddStakeForm } from '../../../../domains/staking/subtensor/hooks/forms'
import { useDelegate } from '../../../../domains/staking/subtensor/hooks/useDelegate'
import { type Stake } from '../../../../domains/staking/subtensor/hooks/useStake'
import { AddStakeDialog as _AddStakeDialog } from '../../../recipes/AddStakeDialog'
import DelegatePickerDialog from './DelegatePickerDialog'
import { CircularProgressIndicator } from '@talismn/ui'
import { useState } from 'react'

type SubtensorAddStakeDialogProps = {
  account: Account
  stake: Stake
  delegate: string
  onRequestDismiss: () => void
}

const SubtensorAddStakeDialog = (props: SubtensorAddStakeDialogProps) => {
  const { input, setInput, amount, transferable, resulting, extrinsic, ready, error } = useAddStakeForm(
    props.account,
    props.stake,
    props.delegate
  )

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)

  const delegateName = useDelegate(props.delegate)?.name

  return (
    <_AddStakeDialog
      message={
        delegateName
          ? `Increase your stake below. Talisman will automatically stake this towards the ${delegateName} delegate.`
          : `Increase your stake below. Talisman will automatically stake this towards your chosen delegate.`
      }
      confirmState={extrinsic.state === 'loading' ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableToStake={transferable.decimalAmount.toLocaleString()}
      amount={input}
      onChangeAmount={setInput}
      onRequestMaxAmount={() => setInput(transferable.decimalAmount.toString())}
      fiatAmount={amount.localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={resulting.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        extrinsic.signAndSend(props.account.address).then(() => props.onRequestDismiss())
      }}
      inputSupportingText={error?.message}
      onDismiss={props.onRequestDismiss}
    />
  )
}

type MultiDelegateAddStakeDialogProps = {
  account: Account
  stake: Stake
  onRequestDismiss: () => void
}

const MultiDelegateAddStakeDialog = (props: MultiDelegateAddStakeDialogProps) => {
  const [delegate, setDelegate] = useState<string>()

  return delegate === undefined ? (
    <DelegatePickerDialog
      title="Select a delegate to increase stake"
      account={props.account}
      onSelect={setDelegate}
      onRequestDismiss={props.onRequestDismiss}
    />
  ) : (
    <SubtensorAddStakeDialog
      account={props.account}
      stake={props.stake}
      delegate={delegate}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

type AddStakeDialogProps = {
  account: Account
  stake: Stake
  onRequestDismiss: () => void
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  if (props.stake.stakes?.length === 1)
    return (
      <SubtensorAddStakeDialog
        account={props.account}
        stake={props.stake}
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        delegate={props.stake.stakes.at(0)?.hotkey!}
        onRequestDismiss={props.onRequestDismiss}
      />
    )

  if ((props.stake.stakes?.length ?? 0) > 1)
    return (
      <MultiDelegateAddStakeDialog
        account={props.account}
        stake={props.stake}
        onRequestDismiss={props.onRequestDismiss}
      />
    )

  return null
}

export default AddStakeDialog
