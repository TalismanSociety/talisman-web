import type { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import { ClassNames, useTheme } from '@emotion/react'
import { useSignetSdk } from '@talismn/signet-apps-sdk'
import { Chip } from '@talismn/ui/atoms/Chip'
import { Hr } from '@talismn/ui/atoms/Hr'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { ListItem } from '@talismn/ui/molecules/ListItem'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui/molecules/SideSheet'
import { toast } from '@talismn/ui/molecules/Toaster'
import { Ethereum, Eye, Polkadot, Wallet } from '@talismn/web-icons'
import { Suspense, useState } from 'react'
import { atom, useRecoilState, useRecoilValue } from 'recoil'
import { useDisconnect as useDisconnectEvm, useAccount as useEvmAccount } from 'wagmi'

import talismanWalletLogo from '@/assets/talisman-wallet.svg'
import { AddReadOnlyAccountDialog } from '@/components/widgets/AddReadOnlyAccountDialog'
import { substrateInjectedAccountsState, writeableEvmAccountsState } from '@/domains/accounts/recoils'
import { useConnectEvm, useEvmConnectors } from '@/domains/extension/evm'
import {
  connectedSubstrateWalletState,
  useConnectedSubstrateWallet,
  useInstalledSubstrateWallets,
  useSubstrateWalletConnect,
} from '@/domains/extension/substrate'

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

  const hasSubWallet = useRecoilValue(connectedSubstrateWalletState) !== undefined
  const hasSubAccounts = useRecoilValue(substrateInjectedAccountsState).length !== 0

  return (
    <section>
      <div className="mb-[16px] flex items-center justify-start gap-[8px] font-bold">
        <Polkadot size="1.6rem" />
        <h4 className="text-[1.8rem]">Substrate wallets</h4>
      </div>
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
      {hasSubWallet && !hasSubAccounts && (
        <div className="mt-2 text-center text-lg text-orange-400">
          Please enable some substrate accounts in your wallet.
        </div>
      )}
    </section>
  )
}

const EvmWalletConnections = () => {
  const connectors = useEvmConnectors()
  const { connector } = useEvmAccount()
  const { connectAsync } = useConnectEvm()
  const { disconnectAsync } = useDisconnectEvm()
  const writeableEvmAccounts = useRecoilValue(writeableEvmAccountsState)

  return (
    <section>
      <div className="mb-[16px] flex items-center justify-start gap-[8px] font-bold">
        <Ethereum size="1.6rem" />
        <h4 className="text-[1.8rem]">Ethereum wallets</h4>
      </div>
      <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <InstallTalisman />
        {connectors.map(x => (
          <WalletConnection
            key={x.uid}
            name={x.name}
            iconUrl={x.icon}
            connected={x.id === connector?.id && writeableEvmAccounts.length > 0}
            onConnectRequest={async () => {
              await disconnectAsync()
              const res = await connectAsync({ connector: x })
              if (res.accounts.length === 0) {
                toast.error('Please enable an ethereum account in your wallet.')
              }
            }}
            onDisconnectRequest={async () => await disconnectAsync()}
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
                      <Text.BodyLarge
                        as="div"
                        alpha="high"
                        css={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '2rem',
                        }}
                      >
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

export const WalletConnectionSideSheet = () => {
  const [open, setOpen] = useRecoilState(walletConnectionSideSheetOpenState)

  if (!open) {
    return null
  }

  return <WalletConnectionSideSheetComponent onRequestDismiss={() => setOpen(false)} />
}
