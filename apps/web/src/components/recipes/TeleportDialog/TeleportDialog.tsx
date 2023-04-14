import { RefreshCw } from '@talismn/icons'
import { FullScreenDialog } from '@talismn/ui'
import { ReactNode } from 'react'

export type TeleportDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  teleportForm: ReactNode
}

const TeleportDialog = (props: TeleportDialogProps) => (
  <FullScreenDialog
    title={
      <div>
        <RefreshCw /> Teleport
      </div>
    }
    {...props}
  >
    {props.teleportForm}
  </FullScreenDialog>
)

export default TeleportDialog
