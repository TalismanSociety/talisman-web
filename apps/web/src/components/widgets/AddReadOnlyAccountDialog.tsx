import AddReadOnlyAccountDialogComponent from '@components/recipes/AddReadOnlyAccountDialog'
import { useAddReadonlyAccountForm } from '@domains/accounts/hooks'
import { isNilOrWhitespace } from '@util/nil'
import { type ReactNode, useCallback, useState } from 'react'

type AddReadOnlyAccountDialogProps = {
  children?: ReactNode | ((props: { onToggleOpen: () => unknown }) => ReactNode)
}

const AddReadOnlyAccountDialog = (props: AddReadOnlyAccountDialogProps) => {
  const [open, setOpen] = useState(false)
  const {
    address: [address, setAddress],
    name: [name, setName],
    resultingAddress,
    confirmState,
    error,
    submit,
  } = useAddReadonlyAccountForm()

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
          submit()
          setOpen(false)
        }, [resultingAddress, submit])}
      />
    </>
  )
}

export default AddReadOnlyAccountDialog
