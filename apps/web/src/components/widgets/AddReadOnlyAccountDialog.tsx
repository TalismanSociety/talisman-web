import AddReadOnlyAccountDialogComponent from '@components/recipes/AddReadOnlyAccountDialog'
import { readOnlyAccountsState } from '@domains/accounts/recoils'
import { isValidSubstrateOrEthereumAddress } from '@util/addressValidation'
import { isNilOrWhitespace } from '@util/nil'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useSetRecoilState } from 'recoil'

type AddReadOnlyAccountDialogProps = {
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

const AddReadOnlyAccountDialog = (props: AddReadOnlyAccountDialogProps) => {
  const [open, setOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [name, setName] = useState('')

  const isValidAddress = useMemo(
    () => (isNilOrWhitespace(address) ? undefined : isValidSubstrateOrEthereumAddress(address)),
    [address]
  )

  const resultingAddress = isValidAddress ? address : undefined

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
        confirmState={isValidAddress ? undefined : 'disabled'}
        addressError={isValidAddress === false ? 'Invalid address' : undefined}
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
