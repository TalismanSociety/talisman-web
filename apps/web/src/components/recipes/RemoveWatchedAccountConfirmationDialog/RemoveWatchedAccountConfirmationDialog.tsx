import { AlertDialog, Button, Text } from '@talismn/ui'

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
