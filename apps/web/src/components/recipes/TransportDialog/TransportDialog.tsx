import { RefreshCw } from '@talismn/icons'
import { SideSheet } from '@talismn/ui'
import { type ReactNode } from 'react'

export type TransportDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  transportForm: ReactNode
}

const TransportDialog = (props: TransportDialogProps) => (
  <SideSheet
    title={
      <div>
        <RefreshCw /> Transport
      </div>
    }
    {...props}
  >
    {props.transportForm}
  </SideSheet>
)

export default TransportDialog
