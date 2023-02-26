import Button from '@components/atoms/Button'
import Identicon from '@components/atoms/Identicon'
import AlertDialog from '@components/molecules/AlertDialog'
import ListItem from '@components/molecules/ListItem'
import TextInput from '@components/molecules/TextInput'
import { useTheme } from '@emotion/react'
import { shortenAddress } from '@util/format'
import { isNilOrWhitespace } from '@util/nil'

export type AddReadOnlyAccountDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  address: string
  onChangeAddress: (address: string) => unknown
  addressError?: string
  name: string
  onChangeName: (name: string) => unknown
  onConfirm: () => unknown
  confirmState?: 'disabled'
  resultingAddress?: string
}

const AddReadOnlyAccountDialog = (props: AddReadOnlyAccountDialogProps) => {
  const theme = useTheme()
  return (
    <AlertDialog
      open={props.open}
      onRequestDismiss={props.onRequestDismiss}
      width="42rem"
      title="Add contact"
      content={
        <form onSubmit={event => event.preventDefault()}>
          <TextInput
            value={props.name}
            onChange={event => props.onChangeName(event.target.value)}
            leadingLabel="Name"
            placeholder="Add a name"
            css={{ fontSize: '1.8rem' }}
          />
          <TextInput
            value={props.address}
            onChange={event => props.onChangeAddress(event.target.value)}
            leadingLabel="Address"
            placeholder="Enter wallet address"
            trailingSupportingText={props.addressError}
            isError={props.addressError !== undefined}
            css={{ fontSize: '1.8rem' }}
          />
          {props.resultingAddress && (
            <ListItem
              leadingContent={<Identicon value={props.resultingAddress} size="4rem" />}
              headlineText={isNilOrWhitespace(props.name) ? undefined : props.name}
              supportingText={shortenAddress(props.resultingAddress)}
              css={{ marginTop: '1.6rem', border: `2px solid ${theme.color.border}`, borderRadius: '0.8rem' }}
            />
          )}
        </form>
      }
      dismissButton={
        <Button variant="outlined" onClick={props.onRequestDismiss}>
          Cancel
        </Button>
      }
      confirmButton={
        <Button onClick={props.onConfirm} disabled={props.confirmState === 'disabled'}>
          Add
        </Button>
      }
    />
  )
}

export default AddReadOnlyAccountDialog
