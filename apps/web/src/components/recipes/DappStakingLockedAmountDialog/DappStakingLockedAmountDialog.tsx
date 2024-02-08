import { AlertDialog, Button, CircularProgressIndicator, Text } from '@talismn/ui'
import { Suspense, type ReactNode } from 'react'

export type DappStakingLockedAmountDialogProps = {
  amount: ReactNode
  fiatAmount: ReactNode
  unlockDuration: ReactNode
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
      means the tokens are locked however they are not staked.
      <br />
      <br />
      Re-staking is instant and will help you maximize your staking rewards.
      <br />
      <br />
      <Text.Body alpha="high">IMPORTANT:</Text.Body> unlocking will take{' '}
      <Suspense fallback={<CircularProgressIndicator size="1em" />}>
        <Text.Body alpha="high">{props.unlockDuration}</Text.Body>
      </Suspense>{' '}
      to complete.
    </Text.Body>
  </AlertDialog>
)

export default DappStakingLockedAmountDialog
