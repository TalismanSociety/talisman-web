import { AlertDialog, Button, Text } from '@talismn/ui'
import type { ReactNode } from 'react'

export type DappStakingLockedAmountDialogProps = {
  amount: ReactNode
  fiatAmount: ReactNode
  onRequestUnlock?: () => unknown
  onRequestReStake?: () => unknown
  requestReStakeInTransition?: boolean
  onRequestDismiss: () => unknown
}

const DappStakingLockedAmountDialog = (props: DappStakingLockedAmountDialogProps) => (
  <AlertDialog
    width="54rem"
    title="Locked token"
    dismissButton={
      <Button variant="outlined" loading={props.requestReStakeInTransition} onClick={props.onRequestReStake}>
        Re-stake
      </Button>
    }
    confirmButton={
      <Button variant="outlined" onClick={props.onRequestUnlock}>
        Unlock
      </Button>
    }
    onRequestDismiss={props.onRequestDismiss}
  >
    <Text.Body as="p">
      The locked amount of{' '}
      <Text.Body alpha="high">
        {props.amount} ({props.fiatAmount})
      </Text.Body>{' '}
      means the tokens are locked however they are not staked. We encourage users to stake all locked tokens at least to
      maximize your staking rewards.
    </Text.Body>
  </AlertDialog>
)

export default DappStakingLockedAmountDialog
