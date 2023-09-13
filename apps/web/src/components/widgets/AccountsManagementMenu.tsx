import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
import {
  portfolioAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { fiatBalancesState, totalPortfolioFiatBalance } from '@domains/balances'
import { copyAddressToClipboard } from '@domains/common/utils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { useTheme } from '@emotion/react'
import { Copy, Download, Eye, EyePlus, Link, PlusCircle, Power, TalismanHand, Trash2, Users, X } from '@talismn/icons'
import {
  CircularProgressIndicator,
  Hr,
  IconButton,
  ListItem,
  Menu,
  Text,
  Tooltip,
  useSurfaceColor,
  type IconButtonProps,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import { useMemo, type ElementType, type ReactNode } from 'react'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import AnimatedFiatNumber from './AnimatedFiatNumber'
import RemoveWatchedAccountConfirmationDialog from './RemoveWatchedAccountConfirmationDialog'

// TODO: probably have this as part of the UI lib
const SurfaceIconButton = <T extends Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>>(
  props: IconButtonProps<T>
) => <IconButton {...props} containerColor={useSurfaceColor()} />

const AccountsManagementSurfaceIconButton = (props: { size?: number | string }) => {
  const theme = useTheme()
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)
  const selectedAccounts = useRecoilValue(selectedAccountsState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)
  const isWeb3Injected = useIsWeb3Injected()

  if ((!isWeb3Injected || !allowExtensionConnection) && readonlyAccounts.length === 0) {
    return (
      <SurfaceIconButton
        as="figure"
        size={props.size}
        containerColor={theme.color.foreground}
        contentColor={theme.color.primary}
        css={{ cursor: 'pointer' }}
      >
        <Link />
      </SurfaceIconButton>
    )
  }

  if (selectedAccounts.length === 1) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      <AccountIcon account={selectedAccounts[0]!} size={props.size ?? '2.4rem'} css={{ cursor: 'pointer' }} />
    )
  }

  return (
    <SurfaceIconButton
      as="figure"
      size={props.size}
      containerColor={theme.color.foreground}
      contentColor={theme.color.primary}
      css={{ cursor: 'pointer' }}
    >
      <Users />
    </SurfaceIconButton>
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
                <SurfaceIconButton
                  as="figure"
                  containerColor={theme.color.foreground}
                  contentColor={theme.color.primary}
                >
                  <Download />
                </SurfaceIconButton>
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
              <SurfaceIconButton as="figure" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                <PlusCircle />
              </SurfaceIconButton>
            }
            headlineText="Connect wallet"
          />
        </Menu.Item>
      )
    }

    return (
      <Menu.Item onClick={() => setSelectedAccountAddresses(undefined)}>
        <ListItem
          headlineText={Maybe.of(totalBalance.valueMaybe()).mapOr(<CircularProgressIndicator size="1em" />, amount => (
            <AnimatedFiatNumber end={amount} />
          ))}
          overlineText="All accounts"
          leadingContent={
            <SurfaceIconButton as="figure" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
              <Users />
            </SurfaceIconButton>
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
            <SurfaceIconButton containerColor={theme.color.foreground}>
              <Power />
            </SurfaceIconButton>
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
        {({ toggleOpen }) => (
          <section css={{ width: 'min(36.2rem, 100vw)' }}>
            <section css={{ marginTop: '1.6rem' }}>
              <Text.Body
                as="header"
                css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  marginBottom: '1.6rem',
                  padding: '0 1.6rem',
                }}
              >
                <div>
                  <TalismanHand size="1em" /> My accounts
                </div>
                <IconButton size="2rem" onClick={toggleOpen}>
                  <X />
                </IconButton>
              </Text.Body>
              {leadingMenuItem}
              {portfolioAccounts.map((x, index) => (
                <Menu.Item key={index} onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                  <ListItem
                    headlineText={Maybe.of(fiatBalances.valueMaybe()).mapOr(
                      <CircularProgressIndicator size="1em" />,
                      balances => (
                        <AnimatedFiatNumber end={balances[x.address] ?? 0} />
                      )
                    )}
                    overlineText={x.name ?? shortenAddress(x.address)}
                    leadingContent={<AccountIcon account={x} size="4rem" />}
                    revealTrailingContentOnHover
                    trailingContent={
                      <SurfaceIconButton
                        size="3.5rem"
                        containerColor={theme.color.foreground}
                        onClick={(event: any) => {
                          event.stopPropagation()
                          void copyAddressToClipboard(x.address)
                        }}
                        css={{ cursor: 'copy' }}
                      >
                        <Copy />
                      </SurfaceIconButton>
                    }
                  />
                </Menu.Item>
              ))}
              {disconnectButton}
            </section>
            <Hr />
            <section>
              <Text.Body
                as="header"
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 'bold',
                  padding: '1.6rem',
                }}
              >
                <Eye size="1em" />
                Followed accounts
              </Text.Body>
              {readonlyAccounts.map((account, index) => (
                <RemoveWatchedAccountConfirmationDialog key={index} account={account}>
                  {({ onToggleOpen: toggleRemoveDialog }) => (
                    <Menu.Item onClick={() => setSelectedAccountAddresses(() => [account.address])}>
                      <ListItem
                        headlineText={Maybe.of(fiatBalances.valueMaybe()).mapOr(
                          <CircularProgressIndicator size="1em" />,
                          balances => (
                            <AnimatedFiatNumber end={balances[account.address] ?? 0} />
                          )
                        )}
                        overlineText={account.name ?? shortenAddress(account.address)}
                        leadingContent={<AccountIcon account={account} size="4rem" />}
                        revealTrailingContentOnHover
                        trailingContent={
                          <div css={{ display: 'flex' }}>
                            <SurfaceIconButton
                              size="3.5rem"
                              containerColor={theme.color.foreground}
                              onClick={(event: any) => {
                                event.stopPropagation()
                                void copyAddressToClipboard(account.address)
                              }}
                              css={{ cursor: 'copy' }}
                            >
                              <Copy />
                            </SurfaceIconButton>
                            <Tooltip
                              content="This account can be managed via the extension"
                              disabled={account.origin === 'local'}
                            >
                              <div>
                                <SurfaceIconButton
                                  size="3.5rem"
                                  containerColor={theme.color.foreground}
                                  onClick={(event: any) => {
                                    event.stopPropagation()
                                    toggleRemoveDialog()
                                  }}
                                  disabled={account.origin !== 'local'}
                                >
                                  <Trash2 />
                                </SurfaceIconButton>
                              </div>
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
                      headlineText="Follow account"
                      leadingContent={
                        <SurfaceIconButton as="figure" containerColor={theme.color.foreground}>
                          <EyePlus />
                        </SurfaceIconButton>
                      }
                    />
                  </Menu.Item>
                )}
              </AddReadOnlyAccountDialog>
            </section>
          </section>
        )}
      </Menu.Items>
    </Menu>
  )
}

export default Object.assign(AccountsManagementMenu, { IconButton: AccountsManagementSurfaceIconButton })
