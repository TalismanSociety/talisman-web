import { useTheme } from '@emotion/react'
import { AlertDialog, Button, Identicon, ListItem, TextInput } from '@talismn/ui'
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
      title="Add watched account"
      content={
        <form
          onSubmit={event => event.preventDefault()}
          css={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
        >
          <TextInput
            value={props.name}
            onChange={event => props.onChangeName(event.target.value)}
            leadingLabel="Name"
            placeholder="Add a name"
          />
          <TextInput
            value={props.address}
            onChange={event => props.onChangeAddress(event.target.value)}
            leadingLabel="Address"
            placeholder="Enter wallet address"
            trailingSupportingText={props.addressError}
            isError={props.addressError !== undefined}
          />
          {props.resultingAddress && (
            <ListItem
              leadingContent={<Identicon value={props.resultingAddress} size="4rem" />}
              headlineText={isNilOrWhitespace(props.name) ? undefined : props.name}
              supportingText={shortenAddress(props.resultingAddress)}
              css={{ marginTop: '0.8rem', border: `2px solid ${theme.color.border}`, borderRadius: '0.8rem' }}
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
