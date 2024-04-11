import RemoveWatchedAccountConfirmationDialogComponent from '@components/recipes/RemoveWatchedAccountConfirmationDialog'
import { useSetReadonlyAccounts } from '@domains/accounts/hooks'
import { type ReadonlyAccount } from '@domains/accounts/recoils'
import { shortenAddress } from '@util/format'
import { isNilOrWhitespace } from '@util/nil'
import { type ReactNode, useCallback, useState } from 'react'

export type RemoveWatchedAccountConfirmationDialogProps = {
  account: ReadonlyAccount
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

const RemoveWatchedAccountConfirmationDialog = (props: RemoveWatchedAccountConfirmationDialogProps) => {
  const [open, setOpen] = useState(false)
  const { remove } = useSetReadonlyAccounts()

  return (
    <>
      {typeof props.children === 'function' ? props.children({ onToggleOpen: () => setOpen(x => !x) }) : props.children}
      <RemoveWatchedAccountConfirmationDialogComponent
        open={open}
        onRequestDismiss={useCallback(() => setOpen(false), [])}
        name={isNilOrWhitespace(props.account.name) ? shortenAddress(props.account.address) : props.account.name}
        onConfirm={useCallback(() => {
          remove(props.account)
          setOpen(false)
        }, [props.account, remove])}
      />
    </>
  )
}

export default RemoveWatchedAccountConfirmationDialog
