import AddReadOnlyAccountDialogComponent from '@components/recipes/AddReadOnlyAccountDialog'
import { readOnlyAccountsState } from '@domains/accounts/recoils'
import { tryParseSubstrateOrEthereumAddress } from '@util/addressValidation'
import { isNilOrWhitespace } from '@util/nil'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

type AddReadOnlyAccountDialogProps = {
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

const AddReadOnlyAccountDialog = (props: AddReadOnlyAccountDialogProps) => {
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')

  const resultingAddress = useMemo(() => tryParseSubstrateOrEthereumAddress(address), [address])

  const hasExistingAccount = useMemo(
    () =>
      resultingAddress !== undefined &&
      readonlyAccounts.map(x => x.address.toLowerCase()).includes(resultingAddress.toLowerCase()),
    [readonlyAccounts, resultingAddress]
  )

  const confirmState = useMemo(() => {
    if (resultingAddress === undefined || hasExistingAccount) {
      return 'disabled'
    }
  }, [hasExistingAccount, resultingAddress])

  const error = useMemo(() => {
    if (address !== '' && resultingAddress === undefined) {
      return 'Invalid address'
    }

    if (hasExistingAccount) {
      return 'This account has already been added'
    }
  }, [address, hasExistingAccount, resultingAddress])

  const setReadOnlyAccounts = useSetRecoilState(readOnlyAccountsState)

  const toggle = useCallback(() => setOpen(x => !x), [])

  return (
    <>
      {typeof props.children === 'function' ? props.children({ onToggleOpen: toggle }) : props.children}
      <AddReadOnlyAccountDialogComponent
        open={open}
        onRequestDismiss={useCallback(() => setOpen(false), [])}
        address={address}
        onChangeAddress={setAddress}
        resultingAddress={resultingAddress}
        name={name}
        onChangeName={setName}
        confirmState={confirmState}
        addressError={error}
        onConfirm={useCallback(() => {
          if (isNilOrWhitespace(resultingAddress)) {
            return
          }
          setReadOnlyAccounts(accounts => [
            ...accounts.filter(x => x.address !== resultingAddress),
            { address: resultingAddress, name: isNilOrWhitespace(name) ? undefined : name },
          ])
          setOpen(false)
        }, [name, resultingAddress, setReadOnlyAccounts])}
      />
    </>
  )
}

export default AddReadOnlyAccountDialog
