import { AlertDialog, Button, Text } from '@talismn/ui'

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

const UnstakeAlertDialog = (props: UnstakeAlertDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Unstake"
    width="48rem"
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

export default UnstakeAlertDialog
