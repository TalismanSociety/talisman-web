import type { Stake } from '@domains/staking/dappStaking'
import { AlertDialog, CircularProgressIndicator, ListItem } from '@talismn/ui'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { useTransition } from 'react'

type DappPickerDialogProps = {
  stake: Stake
  onSelect: (dapp: AstarPrimitivesDappStakingSmartContract) => void
  onRequestDismiss: () => void
}

const DappPickerDialog = (props: DappPickerDialogProps) => {
  const [inTransition, startTransition] = useTransition()
  return (
    <AlertDialog title="Select a DApp" onRequestDismiss={props.onRequestDismiss}>
      {props.stake.dapps.map(([dapp, _]) => (
        <ListItem
          key={dapp.toString()}
          headlineText={dapp.toString()}
          onClick={() => startTransition(() => props.onSelect(dapp))}
        />
      ))}
      {inTransition && <CircularProgressIndicator />}
    </AlertDialog>
  )
}

export default DappPickerDialog
