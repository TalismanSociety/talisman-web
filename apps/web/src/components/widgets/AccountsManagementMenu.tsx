import {
  injectedAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { fiatBalancesState, totalLocalizedFiatBalanceState } from '@domains/balances/recoils'
import { copyAddressToClipboard } from '@domains/common/utils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { useTheme } from '@emotion/react'
import { Copy, Download, Eye, EyePlus, Link, PlusCircle, Power, TalismanHand, Trash2, Users } from '@talismn/icons'
import { CircularProgressIndicator, IconButton, Identicon, ListItem, Menu, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { type ReactNode, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'

import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import RemoveWatchedAccountConfirmationDialog from './RemoveWatchedAccountConfirmationDialog'

const AccountsManagementIconButton = (props: { size?: number | string }) => {
  const theme = useTheme()
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)
  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)
  const isWeb3Injected = useIsWeb3Injected()

  if ((!isWeb3Injected || !allowExtensionConnection) && readonlyAccounts.length === 0) {
    return (
      <IconButton
        as="figure"
        size={props.size}
        containerColor={theme.color.foreground}
        contentColor={theme.color.primary}
        css={{ cursor: 'pointer' }}
      >
        <Link />
      </IconButton>
    )
  }

  if (selectedAccounts.length === 1) {
    return (
      <Identicon value={selectedAccounts[0]?.address ?? ''} size={props.size ?? '2.4rem'} css={{ cursor: 'pointer' }} />
    )
  }

  return (
    <IconButton
      as="figure"
      size={props.size}
      containerColor={theme.color.foreground}
      contentColor={theme.color.primary}
      css={{ cursor: 'pointer' }}
    >
      <Users />
    </IconButton>
  )
}

const AccountsManagementMenu = (props: { button: ReactNode }) => {
  const theme = useTheme()

  const totalBalance = useRecoilValueLoadable(totalLocalizedFiatBalanceState)

  const setSelectedAccountAddresses = useSetRecoilState(selectedAccountAddressesState)
  const injectedAccounts = useRecoilValue(injectedAccountsState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  const fiatBalances = useRecoilValueLoadable(fiatBalancesState)

  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)
  const isWeb3Injected = useIsWeb3Injected()

  const leadingMenuItem = useMemo(() => {
    if (!isWeb3Injected) {
      return (
        <Menu.Item>
          <a href="https://talisman.xyz/download" target="_blank" rel="noreferrer">
            <ListItem
              leadingContent={
                <IconButton as="figure" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                  <Download />
                </IconButton>
              }
              headlineText="Install wallet"
            />
          </a>
        </Menu.Item>
      )
    }

    if (!allowExtensionConnection) {
      return (
        <Menu.Item onClick={() => setAllowExtensionConnection(true)}>
          <ListItem
            leadingContent={
              <IconButton as="figure" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                <PlusCircle />
              </IconButton>
            }
            headlineText="Connect wallet"
          />
        </Menu.Item>
      )
    }

    return (
      <Menu.Item onClick={() => setSelectedAccountAddresses(undefined)}>
        <ListItem
          headlineText="All accounts"
          overlineText={totalBalance.valueMaybe() ?? <CircularProgressIndicator size="1em" />}
          leadingContent={
            <IconButton as="figure" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
              <Users />
            </IconButton>
          }
        />
      </Menu.Item>
    )
  }, [
    allowExtensionConnection,
    isWeb3Injected,
    setAllowExtensionConnection,
    setSelectedAccountAddresses,
    theme.color.foreground,
    theme.color.primary,
    totalBalance,
  ])

  const disconnectButton = useMemo(() => {
    if (!allowExtensionConnection) {
      return null
    }

    return (
      <Menu.Item onClick={() => setAllowExtensionConnection(false)}>
        <ListItem
          leadingContent={
            <IconButton containerColor={theme.color.foreground}>
              <Power />
            </IconButton>
          }
          headlineText="Disconnect wallet"
        />
      </Menu.Item>
    )
  }, [allowExtensionConnection, setAllowExtensionConnection, theme.color.foreground])

  return (
    <Menu>
      <Menu.Button>{props.button}</Menu.Button>
      <Menu.Items>
        <section css={{ width: '34rem' }}>
          <section css={{ margin: '1.6rem 0' }}>
            <Text.Body
              as="header"
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 'bold',
                marginBottom: '1.6rem',
                padding: '0 1.6rem',
              }}
            >
              <TalismanHand size="1em" /> My accounts
            </Text.Body>
            {leadingMenuItem}
            {injectedAccounts.map((x, index) => (
              <Menu.Item key={index} onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? shortenAddress(x.address)}
                  overlineText={
                    fiatBalances.valueMaybe()?.[x.address]?.toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'usd',
                      currencyDisplay: 'narrowSymbol',
                    }) ?? <CircularProgressIndicator size="1em" />
                  }
                  leadingContent={<Identicon value={x.address} size="4rem" />}
                  revealTrailingContentOnHover
                  trailingContent={
                    <IconButton
                      containerColor={theme.color.foreground}
                      onClick={(event: any) => {
                        event.stopPropagation()
                        void copyAddressToClipboard(x.address)
                      }}
                      css={{ cursor: 'copy' }}
                    >
                      <Copy />
                    </IconButton>
                  }
                />
              </Menu.Item>
            ))}
            {disconnectButton}
          </section>
          <section>
            <Text.Body
              as="header"
              css={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', padding: '1.6rem' }}
            >
              <Eye size="1em" /> Watched accounts
            </Text.Body>
            {readonlyAccounts.map((x, index) => (
              <RemoveWatchedAccountConfirmationDialog key={index} account={x}>
                {({ onToggleOpen: toggleRemoveDialog }) => (
                  <Menu.Item onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                    <ListItem
                      headlineText={x.name ?? shortenAddress(x.address)}
                      overlineText={
                        fiatBalances.valueMaybe()?.[x.address]?.toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'usd',
                          currencyDisplay: 'narrowSymbol',
                        }) ?? <CircularProgressIndicator size="1em" />
                      }
                      leadingContent={<Identicon value={x.address} size="4rem" />}
                      revealTrailingContentOnHover
                      trailingContent={
                        <div css={{ display: 'flex' }}>
                          <IconButton
                            containerColor={theme.color.foreground}
                            onClick={(event: any) => {
                              event.stopPropagation()
                              void copyAddressToClipboard(x.address)
                            }}
                            css={{ cursor: 'copy' }}
                          >
                            <Copy />
                          </IconButton>
                          <IconButton
                            containerColor={theme.color.foreground}
                            onClick={(event: any) => {
                              event.stopPropagation()
                              toggleRemoveDialog()
                            }}
                          >
                            <Trash2 />
                          </IconButton>
                        </div>
                      }
                    />
                  </Menu.Item>
                )}
              </RemoveWatchedAccountConfirmationDialog>
            ))}
            <AddReadOnlyAccountDialog>
              {({ onToggleOpen }) => (
                <Menu.Item onClick={onToggleOpen} dismissAfterSelection={false}>
                  <ListItem
                    headlineText="Add watch only address"
                    leadingContent={
                      <IconButton as="figure" containerColor={theme.color.foreground}>
                        <EyePlus />
                      </IconButton>
                    }
                  />
                </Menu.Item>
              )}
            </AddReadOnlyAccountDialog>
          </section>
        </section>
      </Menu.Items>
    </Menu>
  )
}

export default Object.assign(AccountsManagementMenu, { IconButton: AccountsManagementIconButton })
