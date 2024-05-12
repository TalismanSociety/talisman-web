import AddReadOnlyAccountDialogComponent from '../recipes/AddReadOnlyAccountDialog'
import { popularAccounts, useAddReadonlyAccountForm, useSetReadonlyAccounts } from '../../domains/accounts'
import { isNilOrWhitespace } from '../../util/nil'
import { useCallback, useState, type ReactNode } from 'react'

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
    loading,
    error,
    submit,
  } = useAddReadonlyAccountForm()

  const { add: addReadonlyAccount } = useSetReadonlyAccounts()

  const toggle = useCallback(() => setOpen(x => !x), [])

  return (
    <>
      {typeof props.children === 'function' ? props.children({ onToggleOpen: toggle }) : props.children}
      {open && (
        <AddReadOnlyAccountDialogComponent
          onRequestDismiss={() => setOpen(false)}
          address={address}
          onChangeAddress={setAddress}
          resultingAddress={resultingAddress}
          name={name}
          onChangeName={setName}
          confirmState={confirmState}
          addressLoading={loading}
          addressError={error}
          onConfirm={() => {
            if (isNilOrWhitespace(resultingAddress)) {
              return
            }
            submit()
            setOpen(false)
          }}
          popularAccounts={popularAccounts.map(x => (
            <AddReadOnlyAccountDialogComponent.PopularAccount
              key={x.address}
              address={x.address}
              name={x.name ?? ''}
              description={x.description}
              onClick={() => {
                addReadonlyAccount(x)
                setOpen(false)
              }}
            />
          ))}
        />
      )}
    </>
  )
}

export default AddReadOnlyAccountDialog
