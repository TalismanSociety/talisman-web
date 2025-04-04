import { Button } from '@talismn/ui/atoms/Button'
import { Text } from '@talismn/ui/atoms/Text'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'

export type ExportHistoryAlertDialogProps = {
  recordCount: number
  onRequestDismiss: () => unknown
  onConfirm: () => unknown
}

export const ExportHistoryAlertDialog = (props: ExportHistoryAlertDialogProps) => (
  <AlertDialog
    targetWidth="48rem"
    title="Export CSV"
    onRequestDismiss={props.onRequestDismiss}
    confirmButton={<Button onClick={props.onConfirm}>Export {props.recordCount} records</Button>}
  >
    <Text.Body as="p">You are about to export your transaction history as displayed on the screen.</Text.Body>
    <br />
    <Text.Body as="p">
      This export will include{' '}
      <Text.Body alpha="high" css={{ fontWeight: 'bold' }}>
        only the records currently visible
      </Text.Body>
      .<br /> Scroll through your history in order to view and export additional records.
    </Text.Body>
  </AlertDialog>
)
