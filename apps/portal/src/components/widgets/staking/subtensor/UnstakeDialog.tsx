import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useTranslation } from 'react-i18next'

import type { Account } from '@/domains/accounts/recoils'
import { UnstakeDialog as UnstakeDialogComponent } from '@/components/recipes/UnstakeDialog'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useUnstakeForm } from '@/domains/staking/subtensor/hooks/forms'
import { type StakeItem } from '@/domains/staking/subtensor/hooks/useStake'

type DelegateUnstakeDialogProps = {
  account: Account
  stake: StakeItem
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

type UnstakeDialogProps = {
  account: Account
  stake: StakeItem
  onRequestDismiss: () => void
}

const UnstakeDialog = (props: UnstakeDialogProps) => {
  return (
    <DelegateUnstakeDialog
      account={props.account}
      stake={props.stake}
      delegate={props.stake.hotkey}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

export default UnstakeDialog
