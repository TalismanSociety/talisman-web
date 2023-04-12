import { FullScreenDialog, Text } from '@talismn/ui'
import { ReactNode } from 'react'
import { RefreshCw } from '@talismn/icons'
export type TransferDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  transferForm: ReactNode
}

const TransferDialog = (props: TransferDialogProps) => (
  <FullScreenDialog
    title={
      <div>
        <RefreshCw /> Teleport
      </div>
    }
    {...props}
  >
    {props.transferForm}
    <Text.Body as="p" css={{ marginTop: '4.8rem' }}>
      With support for over xx channels xxxxx Powered by Talisman Wayfinder xxx Swaps coming soooon
    </Text.Body>
  </FullScreenDialog>
)

export default TransferDialog
