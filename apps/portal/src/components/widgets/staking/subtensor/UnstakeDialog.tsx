import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { Account } from '@/domains/accounts/recoils'
import { UnstakeDialog as UnstakeDialogComponent } from '@/components/recipes/UnstakeDialog'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useUnstakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { type Stake } from '@/domains/staking/subtensor/hooks/useStake'

import DelegatePickerDialog from './DelegatePickerDialog'

type DelegateUnstakeDialogProps = {
  account: Account
  stake: Stake
  delegate: string
  onRequestDismiss: () => void
}

const DelegateUnstakeDialog = (props: DelegateUnstakeDialogProps) => {
  const { input, setInput, amount, available, resulting, extrinsic, ready, error } = useUnstakeForm(
    props.stake,
    props.delegate
  )
  const { t } = useTranslation()

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)

  return (
    <UnstakeDialogComponent
      confirmState={extrinsic.state === 'loading' ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableAmount={available.decimalAmount.toLocaleString()}
      amount={input}
      onChangeAmount={setInput}
      onRequestMaxAmount={() => setInput(available.decimalAmount.toString())}
      fiatAmount={amount.localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={resulting.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        void extrinsic.signAndSend(props.account.address)
      }}
      inputSupportingText={error?.message}
      onDismiss={props.onRequestDismiss}
      lockDuration={<>{t('None')}</>}
    />
  )
}

type MultiDelegateUnstakeDialogProps = {
  account: Account
  stake: Stake
  onRequestDismiss: () => void
}

const MultiDelegateUnstakeDialog = (props: MultiDelegateUnstakeDialogProps) => {
  const [delegate, setDelegate] = useState<string>()

  return delegate === undefined ? (
    <DelegatePickerDialog
      title="Select a delegate to unstake from"
      account={props.account}
      onSelect={setDelegate}
      onRequestDismiss={props.onRequestDismiss}
    />
  ) : (
    <DelegateUnstakeDialog
      account={props.account}
      stake={props.stake}
      delegate={delegate}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

type UnstakeDialogProps = {
  account: Account
  stake: Stake
  onRequestDismiss: () => void
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
  if (props.stake.stakes?.length === 1)
    return (
      <DelegateUnstakeDialog
        account={props.account}
        stake={props.stake}
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        delegate={props.stake.stakes.at(0)?.hotkey!}
        onRequestDismiss={props.onRequestDismiss}
      />
    )

  if ((props.stake.stakes?.length ?? 0) > 1)
    return (
      <MultiDelegateUnstakeDialog
        account={props.account}
        stake={props.stake}
        onRequestDismiss={props.onRequestDismiss}
      />
    )

  return null
}

export default UnstakeDialog
