import { useTheme } from '@emotion/react'
import { AlertDialog, Button, Clickable, Hr, Identicon, ListItem, TextInput, useSurfaceColor } from '@talismn/ui'
import type { ReactNode } from 'react'
import Loader from '../../../assets/icons/loader.svg?react'
import { shortenAddress } from '../../../util/format'
import { isNilOrWhitespace } from '../../../util/nil'

export type AddReadOnlyAccountDialogProps = {
  open?: boolean
  onRequestDismiss: () => unknown
  address: string
  onChangeAddress: (address: string) => unknown
  addressLoading?: boolean
  addressError?: string
  name: string
  onChangeName: (name: string) => unknown
  onConfirm: () => unknown
  confirmState?: 'disabled'
  resultingAddress?: string
  popularAccounts?: ReactNode
}

const PopularAccount = (props: { address: string; name: string; description?: string; onClick?: () => unknown }) => (
  <Clickable.WithFeedback onClick={props.onClick}>
    <ListItem
      leadingContent={<Identicon value={props.address} size="3.2rem" />}
      headlineContent={props.name}
      supportingContent={props.description ?? shortenAddress(props.address)}
      css={{ borderRadius: '1.2rem', backgroundColor: useSurfaceColor() }}
    />
  </Clickable.WithFeedback>
)

const AddReadOnlyAccountDialog = Object.assign(
  (props: AddReadOnlyAccountDialogProps) => {
    const theme = useTheme()
    return (
      <AlertDialog
        open={props.open}
        onRequestDismiss={props.onRequestDismiss}
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
              trailingIcon={props.addressLoading ? <Loader /> : null}
              isError={props.addressError !== undefined}
            />
            {props.resultingAddress && (
              <ListItem
                leadingContent={<Identicon value={props.resultingAddress} size="4rem" />}
                headlineContent={isNilOrWhitespace(props.name) ? undefined : props.name}
                supportingContent={shortenAddress(props.resultingAddress)}
                css={{ marginTop: '0.8rem', border: `2px solid ${theme.color.outlineVariant}`, borderRadius: '0.8rem' }}
              />
            )}
            <Button
              onClick={props.onConfirm}
              disabled={props.confirmState === 'disabled'}
              css={{ width: '100%', marginTop: '2.4rem' }}
            >
              Add
            </Button>
            <Hr css={{ marginTop: '3.2rem', marginBottom: '3.2rem' }}>Or add one of the popular accounts</Hr>
            <div
              css={{
                display: 'grid',
                gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
                gap: '1.6rem',
                '@media(min-width: 562px)': {
                  gridTemplateColumns: `repeat(2, minmax(0, 1fr))`,
                },
                '@media(min-width: 1024px)': {
                  gridTemplateColumns: `repeat(3, minmax(0, 1fr))`,
                },
              }}
            >
              {props.popularAccounts}
            </div>
          </form>
        }
      />
    )
  },
  { PopularAccount }
)

export default AddReadOnlyAccountDialog
