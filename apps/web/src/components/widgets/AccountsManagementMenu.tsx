import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
import {
  lookupAccountAddressState,
  portfolioAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { fiatBalancesState, totalPortfolioFiatBalance } from '@domains/balances'
import { copyAddressToClipboard } from '@domains/common/utils'
import { useTheme } from '@emotion/react'
import { Copy, Ethereum, Eye, EyePlus, TalismanHand, Trash2, Users, X } from '@talismn/icons'
import {
  Chip,
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
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import AnimatedFiatNumber from './AnimatedFiatNumber'
import RemoveWatchedAccountConfirmationDialog from './RemoveWatchedAccountConfirmationDialog'

const EvmChip = () => {
  const theme = useTheme()
  return (
    <Tooltip content="This is the active account from your EVM wallet">
      <Chip
        leadingContent={<Ethereum />}
        containerColor="linear-gradient(98deg, rgba(178, 190, 255, 0.30) -17.17%, rgba(86, 103, 233, 0.30) 141.82%)"
        contentColor={theme.color.onSurface}
        contentAlpha="high"
      >
        EVM
      </Chip>
    </Tooltip>
  )
}

// TODO: probably have this as part of the UI lib
const SurfaceIconButton = <T extends Extract<ElementType, 'button' | 'a' | 'figure'> | ElementType<any>>(
  props: IconButtonProps<T>
) => <IconButton {...props} containerColor={useSurfaceColor()} />

const AccountsManagementSurfaceIconButton = (props: { size?: number | string }) => {
  const theme = useTheme()
  const selectedAccounts = useRecoilValue(selectedAccountsState)

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
  const resetSelectedAccountAddresses = useResetRecoilState(selectedAccountAddressesState)
  const resetLookupAccountAddress = useResetRecoilState(lookupAccountAddressState)

  const portfolioAccounts = useRecoilValue(portfolioAccountsState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  const fiatBalances = useRecoilValueLoadable(fiatBalancesState)

  const leadingMenuItem = useMemo(() => {
    return (
      <Menu.Item
        onClick={() => {
          resetSelectedAccountAddresses()
          resetLookupAccountAddress()
        }}
      >
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
    resetLookupAccountAddress,
    resetSelectedAccountAddresses,
    theme.color.foreground,
    theme.color.primary,
    totalBalance,
  ])

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
                    overlineText={
                      <div
                        css={
                          x.canSignEvm && {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            marginBottom: '0.25rem',
                          }
                        }
                      >
                        {x.name ?? shortenAddress(x.address)}
                        {x.canSignEvm && <EvmChip />}
                      </div>
                    }
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
