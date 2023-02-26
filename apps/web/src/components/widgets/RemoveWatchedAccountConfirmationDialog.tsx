import RemoveWatchedAccountConfirmationDialogComponent from '@components/recipes/RemoveWatchedAccountConfirmationDialog'
import { ReadonlyAccount, readOnlyAccountsState } from '@domains/accounts/recoils'
import { shortenAddress } from '@util/format'
import { isNilOrWhitespace } from '@util/nil'
import { ReactNode, useCallback, useState } from 'react'
import { useSetRecoilState } from 'recoil'

export type RemoveWatchedAccountConfirmationDialogProps = {
  account: ReadonlyAccount
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

const RemoveWatchedAccountConfirmationDialog = (props: RemoveWatchedAccountConfirmationDialogProps) => {
  const [open, setOpen] = useState(false)
  const setReadonlyAccounts = useSetRecoilState(readOnlyAccountsState)

  return (
    <>
      {typeof props.children === 'function' ? props.children({ onToggleOpen: () => setOpen(x => !x) }) : props.children}
      <RemoveWatchedAccountConfirmationDialogComponent
        open={open}
        onRequestDismiss={useCallback(() => setOpen(false), [])}
        name={isNilOrWhitespace(props.account.name) ? shortenAddress(props.account.address) : props.account.name}
        onConfirm={useCallback(() => {
          setReadonlyAccounts(y => y.filter(z => z.address !== props.account.address))
          setOpen(false)
        }, [props.account.address, setReadonlyAccounts])}
      />
    </>
  )
}

export default RemoveWatchedAccountConfirmationDialog
