import Button from '../../atoms/Button'
import Text from '../../atoms/Text'
import AlertDialog from '../../molecules/AlertDialog'

export type UnstakeAlertDialogProps = {
  open: boolean
  onDismiss: () => unknown
  onConfirm: () => unknown
  confirmState?: 'pending' | 'disabled'
  amount: string
  fiatAmount: string
  lockDuration: string
}

const UnstakeAlertDialog = (props: UnstakeAlertDialogProps) => (
  <AlertDialog
    open={props.open}
    title="Unstake"
    content={
      <>
        You are unstaking{' '}
        <Text alpha="high">
          <strong>
            ${props.amount} ({props.fiatAmount})
          </strong>
        </Text>
        .
        <br />
        <br />
        Please note that when unstaking there is a{' '}
        <Text alpha="high">
          <strong>{props.lockDuration} unstaking period</strong>
        </Text>{' '}
        before your funds become available.
      </>
    }
    dismissButton={
      <Button variant="outlined" onClick={props.onDismiss}>
        Cancel
      </Button>
    }
    confirmButton={
      <Button onClick={props.onConfirm} loading={props.confirmState === 'pending'}>
        Confirm
      </Button>
    }
    onRequestDismiss={props.onDismiss}
  />
)

export default UnstakeAlertDialog
