import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'

import type { Account } from '@/domains/accounts/recoils'
import { AddStakeDialog as _AddStakeDialog } from '@/components/recipes/AddStakeDialog'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useAddStakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { useDelegate } from '@/domains/staking/subtensor/hooks/useDelegate'
import { type StakeItem } from '@/domains/staking/subtensor/hooks/useStake'

type SubtensorAddStakeDialogProps = {
  account: Account
  stake: StakeItem
  delegate: string
  onRequestDismiss: () => void
}

const SubtensorAddStakeDialog = ({ account, stake, delegate, onRequestDismiss }: SubtensorAddStakeDialogProps) => {
  const { input, setInput, amount, transferable, resulting, extrinsic, ready, error, talismanFeeTokenAmount } =
    useAddStakeForm(account, stake, delegate, stake.netuid)

  useExtrinsicInBlockOrErrorEffect(() => onRequestDismiss(), extrinsic)

  const delegateName = useDelegate(delegate)?.name

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
        extrinsic.signAndSend(account.address).then(() => onRequestDismiss())
      }}
      inputSupportingText={error?.message}
      onDismiss={onRequestDismiss}
      talismanFeeTokenAmount={talismanFeeTokenAmount}
    />
  )
}

type AddStakeDialogProps = {
  account: Account
  stake: StakeItem
  onRequestDismiss: () => void
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  return (
    <SubtensorAddStakeDialog
      account={props.account}
      stake={props.stake}
      delegate={props.stake.hotkey}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

export default AddStakeDialog
