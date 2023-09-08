import { Transaction } from '@domains/multisig'
import { SideSheet } from '@talismn/ui'
import { FullScreenDialogContents, FullScreenDialogContentsProps, FullScreenDialogTitle } from './FullScreenSummary'

type Props = {
  onClose: () => void
  open: boolean
  t?: Transaction
} & FullScreenDialogContentsProps

// TODD: use this on all actions to reduce code duplication + maintain implementation consistency
const TransactionSummarySideSheet: React.FC<Props> = ({ onClose, open, t, ...contentsProps }) => (
  <SideSheet
    onRequestDismiss={onClose}
    title={<FullScreenDialogTitle t={t} />}
    open={open}
    css={{
      header: {
        margin: '32px 48px',
      },
      height: '100vh',
      background: 'var(--color-grey800)',
      maxWidth: '781px',
      minWidth: '700px',
      width: '100%',
      padding: '0 !important',
    }}
  >
    <FullScreenDialogContents t={t} {...contentsProps} />
  </SideSheet>
)

export default TransactionSummarySideSheet
