import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import { RemoveWatchedAccountConfirmationDialog as RemoveWatchedAccountConfirmationDialogComponent } from '@/components/recipes/RemoveWatchedAccountConfirmationDialog'
import { useSetReadonlyAccounts } from '@/domains/accounts/hooks'
import { type ReadonlyAccount } from '@/domains/accounts/recoils'
import { isNilOrWhitespace } from '@/util/nil'
import { shortenAddress } from '@/util/shortenAddress'

export type RemoveWatchedAccountConfirmationDialogProps = {
  account: ReadonlyAccount
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

export const RemoveWatchedAccountConfirmationDialog = (props: RemoveWatchedAccountConfirmationDialogProps) => {
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
