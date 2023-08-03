import {
  portfolioAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { fiatBalancesState, totalPortfolioFiatBalance } from '@domains/balances/recoils'
import { copyAddressToClipboard } from '@domains/common/utils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { useTheme } from '@emotion/react'
import { Copy, Download, Eye, EyePlus, Link, PlusCircle, Power, TalismanHand, Trash2, Users } from '@talismn/icons'
import { CircularProgressIndicator, IconButton, Identicon, ListItem, Menu, Text, Tooltip } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import { useMemo, type ReactNode } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import AnimatedFiatNumber from './AnimatedFiatNumber'
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

  const totalBalance = useRecoilValueLoadable(totalPortfolioFiatBalance)

  const setSelectedAccountAddresses = useSetRecoilState(selectedAccountAddressesState)
  const portfolioAccounts = useRecoilValue(portfolioAccountsState)
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
          overlineText={Maybe.of(totalBalance.valueMaybe()).mapOr(<CircularProgressIndicator size="1em" />, amount => (
            <AnimatedFiatNumber end={amount} />
          ))}
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
            {portfolioAccounts.map((x, index) => (
              <Menu.Item key={index} onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? shortenAddress(x.address)}
                  overlineText={Maybe.of(fiatBalances.valueMaybe()).mapOr(
                    <CircularProgressIndicator size="1em" />,
                    balances => (
                      <AnimatedFiatNumber end={balances[x.address] ?? 0} />
                    )
                  )}
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
            {readonlyAccounts.map((account, index) => (
              <RemoveWatchedAccountConfirmationDialog key={index} account={account}>
                {({ onToggleOpen: toggleRemoveDialog }) => (
                  <Menu.Item onClick={() => setSelectedAccountAddresses(() => [account.address])}>
                    <ListItem
                      headlineText={account.name ?? shortenAddress(account.address)}
                      overlineText={Maybe.of(fiatBalances.valueMaybe()).mapOr(
                        <CircularProgressIndicator size="1em" />,
                        balances => (
                          <AnimatedFiatNumber end={balances[account.address] ?? 0} />
                        )
                      )}
                      leadingContent={<Identicon value={account.address} size="4rem" />}
                      revealTrailingContentOnHover
                      trailingContent={
                        <div css={{ display: 'flex' }}>
                          <IconButton
                            containerColor={theme.color.foreground}
                            onClick={(event: any) => {
                              event.stopPropagation()
                              void copyAddressToClipboard(account.address)
                            }}
                            css={{ cursor: 'copy' }}
                          >
                            <Copy />
                          </IconButton>
                          <Tooltip
                            content="This account can be managed via the extension"
                            disabled={account.origin === 'local'}
                          >
                            {tooltipProps => (
                              <div {...tooltipProps}>
                                <IconButton
                                  containerColor={theme.color.foreground}
                                  onClick={(event: any) => {
                                    event.stopPropagation()
                                    toggleRemoveDialog()
                                  }}
                                  disabled={account.origin !== 'local'}
                                >
                                  <Trash2 />
                                </IconButton>
                              </div>
                            )}
                          </Tooltip>
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
