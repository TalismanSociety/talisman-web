import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { useState } from 'react'

import type { Account } from '@/domains/accounts/recoils'
import { DappStakingAddStakeDialog } from '@/components/recipes/AddStakeDialog'
import { useExtrinsicInBlockOrErrorEffect } from '@/domains/common/hooks/useExtrinsicEffect'
import { useAddStakeForm } from '@/domains/staking/dappStaking/hooks/forms'
import { StakeLoadable } from '@/domains/staking/dappStaking/hooks/useStakeLoadable'

import DappPickerDialog from './DappPickerDialog'

type DappAddStakeDialogProps = {
  account: Account
  stake: StakeLoadable['data']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
  onRequestDismiss: () => void
}

const DappAddStakeDialog = (props: DappAddStakeDialogProps) => {
  const { input, setAmount, available, resulting, error, extrinsic, ready } = useAddStakeForm(
    props.account,
    props.stake,
    props.dapp
  )

  useExtrinsicInBlockOrErrorEffect(() => props.onRequestDismiss(), extrinsic)

  return (
    <DappStakingAddStakeDialog
      confirmState={extrinsic.state === 'loading' ? 'pending' : !ready ? 'disabled' : undefined}
      isError={error !== undefined}
      availableToStake={available.decimalAmount.toLocaleString()}
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
    />
  )
}

type MultiDappsAddStakeDialogProps = {
  account: Account
  stake: StakeLoadable['data']
  onRequestDismiss: () => void
}

const MultiDappAddStakeDialog = (props: MultiDappsAddStakeDialogProps) => {
  const [dapp, setDapp] = useState<AstarPrimitivesDappStakingSmartContract>()

  return dapp === undefined ? (
    <DappPickerDialog
      title="Select a DApp to increase stake"
      stake={props.stake}
      onSelect={setDapp}
      onRequestDismiss={props.onRequestDismiss}
    />
  ) : (
    <DappAddStakeDialog
      account={props.account}
      stake={props.stake}
      dapp={dapp}
      onRequestDismiss={props.onRequestDismiss}
    />
  )
}

type AddStakeDialogProps = {
  account: Account
  stake: StakeLoadable['data']
  onRequestDismiss: () => void
}

const AddStakeDialog = (props: AddStakeDialogProps) => {
  if (props.stake.dapps.length === 1) {
    return (
      <DappAddStakeDialog
        account={props.account}
        stake={props.stake}
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        dapp={props.stake.dapps.at(0)?.[0]!}
        onRequestDismiss={props.onRequestDismiss}
      />
    )
  }

  if (props.stake.dapps.length > 1) {
    return (
      <MultiDappAddStakeDialog account={props.account} stake={props.stake} onRequestDismiss={props.onRequestDismiss} />
    )
  }

  return null
}

export default AddStakeDialog
