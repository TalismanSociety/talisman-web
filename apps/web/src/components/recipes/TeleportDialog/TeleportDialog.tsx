import { RefreshCw } from '@talismn/icons'
import { SideSheet } from '@talismn/ui'
import { type ReactNode } from 'react'

export type TeleportDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  teleportForm: ReactNode
}

const TeleportDialog = (props: TeleportDialogProps) => (
  <SideSheet
    title={
      <div>
        <RefreshCw /> Teleport
      </div>
    }
    {...props}
  >
    {props.teleportForm}
  </SideSheet>
)

export default TeleportDialog
