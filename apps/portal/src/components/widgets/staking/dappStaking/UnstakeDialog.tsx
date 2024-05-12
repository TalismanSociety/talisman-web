import UnstakeDialogComponent from '../../../recipes/UnstakeDialog'
import type { Account } from '../../../../domains/accounts'
import { useExtrinsicInBlockOrErrorEffect } from '../../../../domains/common'
import { useUnstakeForm, type Stake } from '../../../../domains/staking/dappStaking'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { CircularProgressIndicator } from '@talismn/ui'
import { useState } from 'react'
import DappPickerDialog from './DappPickerDialog'
import UnlockDuration from './UnlockDuration'

type DappUnstakeDialogProps = {
  account: Account
  stake: Stake
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
  onRequestDismiss: () => void
}

const DappUnstakeDialog = (props: DappUnstakeDialogProps) => {
  const { input, setAmount, available, resulting, error, extrinsic, ready } = useUnstakeForm(
    props.account,
    props.stake,
    props.dapp
  )

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)

  return (
    <UnstakeDialogComponent
      confirmState={extrinsic.state === 'loading' ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableAmount={available.decimalAmount.toLocaleString()}
      amount={input.amount}
      onChangeAmount={setAmount}
      onRequestMaxAmount={() => setAmount(available.decimalAmount.toString())}
      fiatAmount={input.localizedFiatAmount ?? ''}
      newAmount={resulting.decimalAmount?.toLocaleString() ?? <CircularProgressIndicator size="1em" />}
      newFiatAmount={resulting.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      onConfirm={() => {
        void extrinsic.signAndSend(props.account.address)
      }}
      inputSupportingText={error?.message}
      onDismiss={props.onRequestDismiss}
      lockDuration={<UnlockDuration />}
    />
  )
}

type MultiDappsUnstakeDialogProps = {
  account: Account
  stake: Stake
  onRequestDismiss: () => void
}

const MultiDappUnstakeDialog = (props: MultiDappsUnstakeDialogProps) => {
  const [dapp, setDapp] = useState<AstarPrimitivesDappStakingSmartContract>()

  return dapp === undefined ? (
    <DappPickerDialog
      title="Select a DApp to unstake from"
      stake={props.stake}
      onSelect={setDapp}
      onRequestDismiss={props.onRequestDismiss}
    />
  ) : (
    <DappUnstakeDialog
      account={props.account}
      stake={props.stake}
      dapp={dapp}
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
  if (props.stake.dapps.length === 1) {
    return (
      <DappUnstakeDialog
        account={props.account}
        stake={props.stake}
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        dapp={props.stake.dapps.at(0)?.[0]!}
        onRequestDismiss={props.onRequestDismiss}
      />
    )
  }

  if (props.stake.dapps.length > 1) {
    return (
      <MultiDappUnstakeDialog account={props.account} stake={props.stake} onRequestDismiss={props.onRequestDismiss} />
    )
  }

  return null
}

export default UnstakeDialog
