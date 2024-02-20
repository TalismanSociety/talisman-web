import talismanWalletLogo from '@assets/talisman-wallet.svg'
import {
  useConnectEip6963,
  useConnectedSubstrateWallet,
  useEip6963Providers,
  useInstalledSubstrateWallets,
  useSubstrateWalletConnect,
} from '@domains/extension'
import { ClassNames, useTheme } from '@emotion/react'
import { Ethereum, Eye, Polkadot, Wallet } from '@talismn/web-icons'
import { Chip, Hr, ListItem, SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet, Surface, Text } from '@talismn/ui'
import { Suspense, useEffect, useState, type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react'
import { atom, useRecoilState } from 'recoil'
import { useAccount } from 'wagmi'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import { useSignetSdk } from '@talismn/signet-apps-sdk'

const talismanInstalled = 'talismanEth' in globalThis

type ConnectionButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  connected?: boolean
  hovered?: boolean
}

const ConnectionChip = (props: ConnectionButtonProps) => {
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
        pointerEvents: 'none',
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
  nonInteractive?: boolean
}

const itemStyle = () => ({
  borderRadius: '1.2rem',
  cursor: 'pointer',
  ':hover': { filter: 'brightness(1.2)' },
  [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '40rem' },
})

const WalletConnection = (props: WalletConnectionProps) => {
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
      headlineContent={<Text.BodyLarge alpha="high">{props.name}</Text.BodyLarge>}
      trailingContent={<ConnectionChip connected={props.connected} hovered={!props.nonInteractive && hovered} />}
      onClick={props.connected ? props.onDisconnectRequest : props.onConnectRequest}
      onMouseEnter={() => setHovered(!props.nonInteractive)}
      onMouseLeave={() => setHovered(false)}
      css={itemStyle}
    />
  )
}

const InstallTalisman = () => {
  if (talismanInstalled) {
    return null
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href="https://talisman.xyz/download" target="_blank" css={{ display: 'contents' }}>
      <Surface
        as={ListItem}
        headlineContent={<Text.BodyLarge alpha="high">Talisman</Text.BodyLarge>}
        leadingContent={<img src={talismanWalletLogo} alt="Talisman" css={{ width: '2.4rem', aspectRatio: '1 / 1' }} />}
        trailingContent={
          <Chip
            size="lg"
            css={{
              border: `1px solid transparent`,
              borderRadius: '2rem',
              padding: '0.6rem 0.8rem',
            }}
          >
            Install wallet
          </Chip>
        }
        css={itemStyle}
      />
    </a>
  )
}

const SubstrateWalletConnection = () => {
  const wallets = useInstalledSubstrateWallets()
  const connectedWallet = useConnectedSubstrateWallet()
  const { connect, disconnect } = useSubstrateWalletConnect()

  return (
    <section>
      <Text.H4 css={{ marginBottom: '1.6rem' }}>
        <Polkadot size="1.6rem" css={{ marginRight: '1.2rem' }} /> Substrate wallets
      </Text.H4>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <InstallTalisman />
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
      <Text.H4 css={{ marginBottom: '1.6rem' }}>
        <Ethereum size="1.6rem" css={{ marginRight: '1.2rem' }} /> Ethereum wallets
      </Text.H4>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <InstallTalisman />
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
  const { inSignet } = useSignetSdk()
  return (
    <ClassNames>
      {({ css }) => (
        <SideSheet
          title="Connect wallet"
          headerClassName={css({ marginBottom: '3.2rem' })}
          onRequestDismiss={props.onRequestDismiss}
        >
          {!inSignet && (
            <Text.Body as="h3" css={{ marginBottom: '3.2rem' }}>
              Select the wallet to connect to Talisman Portal
            </Text.Body>
          )}
          {inSignet ? (
            <WalletConnection
              name="Signet"
              // TODO: update to signet official domain for logo
              iconUrl="https://legendary-griffin-27eef8.netlify.app/logo192.png"
              connected
              nonInteractive
              onConnectRequest={() => {}}
              onDisconnectRequest={() => {}}
            />
          ) : (
            <div css={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
              <Suspense fallback={<div css={{ [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { minWidth: '40rem' } }} />}>
                <SubstrateWalletConnection />
                <EvmWalletConnections />
              </Suspense>
              <div>
                <Hr css={{ marginTop: '1.6rem', marginBottom: '1.6rem' }}>Don't want to connect a wallet?</Hr>
                <AddReadOnlyAccountDialog>
                  {({ onToggleOpen }) => (
                    <button css={{ display: 'contents', cursor: 'pointer' }} onClick={onToggleOpen}>
                      <Text.BodyLarge as="div" alpha="high" css={{ textAlign: 'center' }}>
                        <Eye size="2rem" css={{ verticalAlign: 'text-top' }} /> Add watched account
                      </Text.BodyLarge>
                    </button>
                  )}
                </AddReadOnlyAccountDialog>
              </div>
            </div>
          )}
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
