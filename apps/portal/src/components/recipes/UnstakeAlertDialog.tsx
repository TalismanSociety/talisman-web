import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'

export type UnstakeAlertDialogProps = {
  open: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  confirmState?: 'pending' | 'disabled'
  amount: string
  fiatAmount: string
  lockDuration: string
  isLeaving?: boolean
}

export const UnstakeAlertDialog = (props: UnstakeAlertDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Unstake"
    targetWidth="48rem"
    content={
      <Text.Body>
        You are unstaking{' '}
        <Text.Body alpha="high">
          <strong>
            ${props.amount} ({props.fiatAmount})
          </strong>
        </Text.Body>
        .
        <br />
        <br />
        Please note that when unstaking there is a{' '}
        <Text.Body alpha="high">
          <strong>{props.lockDuration} unstaking period</strong>
        </Text.Body>{' '}
        before your funds become available.
      </Text.Body>
    }
    dismissButton={
      <Button variant="outlined" onClick={props.onDismiss}>
        Cancel
      </Button>
    }
    confirmButton={
      <Button onClick={props.onConfirm} loading={props.confirmState === 'pending'}>
        {props.isLeaving ? 'Leave Pool' : 'Confirm'}
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)
