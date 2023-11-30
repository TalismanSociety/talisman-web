import {
  useConnectEip6963,
  useConnectedSubstrateWallet,
  useEip6963Providers,
  useInstalledSubstrateWallets,
  useSubstrateWalletConnect,
} from '@domains/extension'
import { ClassNames, useTheme } from '@emotion/react'
import { Wallet } from '@talismn/icons'
import { Chip, ListItem, SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet, Surface, Text } from '@talismn/ui'
import { useEffect, useState, type ButtonHTMLAttributes, type DetailedHTMLProps, Suspense } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAccount } from 'wagmi'

type ConnectionButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  connected?: boolean
  hovered?: boolean
}

const ConnectionButton = (props: ConnectionButtonProps) => {
  const theme = useTheme()
  const toDisconnect = props.hovered && props.connected
  const connectionColor = toDisconnect ? theme.color.error : props.connected ? '#38D448' : theme.color.onSurface
  return (
    <Chip
      {...props}
      size="lg"
      css={{
        border: `1px solid ${connectionColor}`,
        borderRadius: '2rem',
        background: 'transparent',
        padding: '0.6rem 0.8rem',
      }}
      leadingContent={
        <div
          css={{
            position: 'relative',
            width: '1.4rem',
            height: '1.4rem',
            border: `0.2rem solid color-mix(in srgb, ${connectionColor}, transparent 70%)`,
            borderRadius: '0.7rem',
          }}
        >
          <div css={{ position: 'absolute', inset: '0.2rem', borderRadius: '50%', backgroundColor: connectionColor }} />
        </div>
      }
    >
      <Text.BodyLarge alpha="high">
        {toDisconnect ? 'Disconnect' : props.connected ? 'Connected' : 'Connect'}
      </Text.BodyLarge>
    </Chip>
  )
}

type WalletConnectionProps = {
  name: string
  iconUrl?: string
  connected?: boolean
  onConnectRequest: () => unknown
  onDisconnectRequest: () => unknown
}

const WalletConnection = (props: WalletConnectionProps) => {
  const theme = useTheme()
  const [hovered, setHovered] = useState(false)
  return (
    <Surface
      as={ListItem}
      leadingContent={
        props.iconUrl ? (
          <img src={props.iconUrl} alt={props.name} css={{ width: '2.4rem', aspectRatio: '1 / 1' }} />
        ) : (
          <Wallet size="2.4rem" />
        )
      }
      headlineText={<Text.BodyLarge alpha="high">{props.name}</Text.BodyLarge>}
      trailingContent={<ConnectionButton connected={props.connected} hovered={hovered} />}
      onClick={props.connected ? props.onDisconnectRequest : props.onConnectRequest}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      css={{
        'borderRadius': '1.2rem',
        'cursor': 'pointer',
        ':hover': { opacity: theme.contentAlpha.medium },
        [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '40rem' },
      }}
    />
  )
}

const SubstrateWalletConnection = () => {
  const wallets = useInstalledSubstrateWallets()
  const connectedWallet = useConnectedSubstrateWallet()
  const { connect, disconnect } = useSubstrateWalletConnect()

  return (
    <section>
      <Text.H4 css={{}}>Substrate wallets</Text.H4>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {wallets.map((x, index) => (
          <WalletConnection
            key={index}
            name={x.metadata.title}
            iconUrl={x.metadata.iconUrl}
            connected={x.metadata.id === connectedWallet?.metadata.id}
            onConnectRequest={() => connect(x)}
            onDisconnectRequest={() => disconnect()}
          />
        ))}
      </div>
    </section>
  )
}

const EvmWalletConnections = () => {
  const { connect, disconnect } = useConnectEip6963()
  const providers = useEip6963Providers()
  const { connector } = useAccount()

  const [connectedProvider, setConnectedProvider] = useState<any>()

  useEffect(() => {
    if (connector === undefined) {
      setConnectedProvider(undefined)
    }

    if (connector?.ready) {
      void connector.getProvider().then(setConnectedProvider)
    }
  }, [connector])

  return (
    <section>
      <Text.H4 css={{}}>Ethereum wallets</Text.H4>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {providers.map(x => (
          <WalletConnection
            key={x.info.uuid}
            name={x.info.name}
            iconUrl={x.info.icon}
            connected={connectedProvider === x.provider}
            onConnectRequest={() => connect(x)}
            onDisconnectRequest={() => disconnect()}
          />
        ))}
      </div>
    </section>
  )
}

type WalletConnectionSideSheetProps = {
  onRequestDismiss: () => unknown
}

export const WalletConnectionSideSheetComponent = (props: WalletConnectionSideSheetProps) => {
  return (
    <ClassNames>
      {({ css }) => (
        <SideSheet
          title="Connect wallet"
          headerClassName={css({ marginBottom: '3.2rem' })}
          onRequestDismiss={props.onRequestDismiss}
        >
          <Text.Body as="h3" css={{ marginBottom: '3.2rem' }}>
            Select the wallet to connect to Talisman Portal
          </Text.Body>
          <div css={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
            <Suspense fallback={<div css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '40rem' } }} />}>
              <SubstrateWalletConnection />
              <EvmWalletConnections />
            </Suspense>
          </div>
        </SideSheet>
      )}
    </ClassNames>
  )
}

export const walletConnectionSideSheetOpenState = atom({ key: 'WalletConnectionSideSheetOpen', default: false })

const WalletConnectionSideSheet = () => {
  const [open, setOpen] = useRecoilState(walletConnectionSideSheetOpenState)

  if (!open) {
    return null
  }

  return <WalletConnectionSideSheetComponent onRequestDismiss={() => setOpen(false)} />
}

export default WalletConnectionSideSheet
