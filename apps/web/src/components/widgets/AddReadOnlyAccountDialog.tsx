import AddReadOnlyAccountDialogComponent from '@components/recipes/AddReadOnlyAccountDialog'
import { readOnlyAccountsState } from '@domains/accounts/recoils'
import { isValidSubstrateOrEthereumAddress } from '@util/addressValidation'
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

  const isValidAddress = useMemo(
    () => (isNilOrWhitespace(address) ? undefined : isValidSubstrateOrEthereumAddress(address)),
    [address]
  )

  const resultingAddress = isValidAddress ? address : undefined

  const hasExistingAccount = useMemo(
    () => readonlyAccounts.map(x => x.address.toLowerCase()).includes(address.toLowerCase()),
    [address, readonlyAccounts]
  )

  const confirmState = useMemo(() => {
    if (!isValidAddress || hasExistingAccount) {
      return 'disabled'
    }
  }, [hasExistingAccount, isValidAddress])

  const error = useMemo(() => {
    if (isValidAddress === false) {
      return 'Invalid address'
    }

    if (hasExistingAccount) {
      return 'This account has already been added'
    }
  }, [hasExistingAccount, isValidAddress])

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
