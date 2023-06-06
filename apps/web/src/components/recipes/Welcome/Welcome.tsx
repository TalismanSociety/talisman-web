import { useTheme } from '@emotion/react'
import {
  Button,
  type ButtonProps,
  Clickable,
  Hr,
  Identicon,
  ListItem,
  Text,
  TextInput,
  type TextInputProps,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { type ReactNode } from 'react'

export type WelcomeProps = {
  className?: string
  walletButton: ReactNode
  addressInput: ReactNode
  addressInputConfirmButton: ReactNode
  popularAccounts: ReactNode
}

const WalletButton = <T extends 'a' | 'button'>({
  variant,
  ...props
}: Omit<ButtonProps<T>, 'variant' | 'children'> & { variant: 'install' | 'connect' }) => (
  <Button {...props} css={{ padding: '2rem 5.6rem' }}>
    {variant === 'connect' ? 'Connect wallet' : 'Install wallet'}
  </Button>
)

const AddressInput = (props: Omit<TextInputProps, 'placeholder' | 'width' | 'noLabel'>) => (
  <TextInput {...props} placeholder="Enter any address" width="100%" css={{ fontSize: '1.6rem' }} />
)

const AddressInputConfirmButton = (props: Omit<ButtonProps, 'variant' | 'children'>) => (
  <Button {...props} variant="outlined" css={{ flex: 0, paddingRight: '5.4rem', paddingLeft: '5.4rem' }}>
    Add
  </Button>
)

const PopularAccount = (props: { address: string; name: string; description?: string; onClick?: () => unknown }) => {
  const theme = useTheme()
  return (
    <Clickable.WithFeedback onClick={props.onClick}>
      <ListItem
        leadingContent={<Identicon value={props.address} size="3.2rem" />}
        headlineText={props.name}
        supportingText={props.description ?? shortenAddress(props.address)}
        css={{ borderRadius: '1.2rem', backgroundColor: theme.color.foreground }}
      />
    </Clickable.WithFeedback>
  )
}

const Welcome = Object.assign(
  (props: WelcomeProps) => (
    <section className={props.className} css={{ maxWidth: 727 }}>
      <section css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Text.H1
          css={{
            'fontSize': '3.6rem',
            'textAlign': 'center',
            '@media (min-width: 1024px)': {
              fontSize: '4.6rem',
            },
          }}
        >
          Welcome to the
          <br />
          <span css={{ whiteSpace: 'nowrap' }}>Talisman Portal</span>
        </Text.H1>
        {props.walletButton}
      </section>
      <Hr css={{ margin: '4.8rem 0' }} />
      <div css={{ padding: '0 2.4rem' }}>
        <section>
          <Text.Body as="h2" css={{ textAlign: 'center', marginBottom: '2.4rem' }}>
            Or lookup any wallet address
          </Text.Body>
          <form
            onSubmit={event => event.preventDefault()}
            css={{
              'display': 'flex',
              'flexDirection': 'column',
              'gap': '1.6rem',
              '@media (min-width: 1024px)': {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'stretch',
              },
            }}
          >
            <div css={{ flex: 1 }}>{props.addressInput}</div>
            {props.addressInputConfirmButton}
          </form>
        </section>
        <section css={{ marginTop: '4.8rem' }}>
          <Text.Body as="h2" css={{ textAlign: 'center', marginBottom: '2.4rem' }}>
            Popular accounts
          </Text.Body>
          <div
            css={{
              'display': 'grid',
              'gridTemplateColumns': `repeat(1, minmax(0, 1fr))`,
              'gap': '1.6rem 2.4rem',
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
        </section>
      </div>
    </section>
  ),
  { WalletButton, AddressInput, AddressInputConfirmButton, PopularAccount }
)

export default Welcome
