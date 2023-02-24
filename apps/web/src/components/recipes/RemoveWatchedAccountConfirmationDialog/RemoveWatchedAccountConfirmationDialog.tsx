import Button from '@components/atoms/Button'
import Text from '@components/atoms/Text'
import AlertDialog from '@components/molecules/AlertDialog'

export type RemoveWatchedAccountConfirmationDialogProps = {
  open: boolean
  onRequestDismiss: () => unknown
  name: string
  onConfirm: () => unknown
}

const RemoveWatchedAccountConfirmationDialog = (props: RemoveWatchedAccountConfirmationDialogProps) => (
  <AlertDialog
    open={props.open}
    onRequestDismiss={props.onRequestDismiss}
    title="Remove watched account"
    content={
      <Text.Body>
        Are you sure you want to remove <Text.Body alpha="high">{props.name}</Text.Body> as a watched account?
      </Text.Body>
    }
    dismissButton={
      <Button variant="outlined" onClick={props.onRequestDismiss}>
        Cancel
      </Button>
    }
    confirmButton={<Button onClick={props.onConfirm}>Confirm</Button>}
  />
)

export default RemoveWatchedAccountConfirmationDialog
