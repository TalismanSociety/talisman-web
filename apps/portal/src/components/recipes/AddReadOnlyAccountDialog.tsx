import type { ReactNode } from 'react'
import { useTheme } from '@emotion/react'
import { Button } from '@talismn/ui/atoms/Button'
import { Clickable } from '@talismn/ui/atoms/Clickable'
import { Hr } from '@talismn/ui/atoms/Hr'
import { Identicon } from '@talismn/ui/atoms/Identicon'
import { useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { AlertDialog } from '@talismn/ui/molecules/AlertDialog'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { TextInput } from '@talismn/ui/molecules/TextInput'

import Loader from '@/assets/icons/loader.svg?react'
import { isNilOrWhitespace } from '@/util/nil'
import { truncateAddress } from '@/util/truncateAddress'

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
      supportingContent={props.description ?? truncateAddress(props.address)}
      css={{ borderRadius: '1.2rem', backgroundColor: useSurfaceColor() }}
    />
  </Clickable.WithFeedback>
)

export const AddReadOnlyAccountDialog = Object.assign(
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
                supportingContent={truncateAddress(props.resultingAddress)}
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
