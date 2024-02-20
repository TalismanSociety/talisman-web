import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
import {
  lookupAccountAddressState,
  portfolioAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '@domains/accounts/recoils'
import { fiatBalanceGetterState, portfolioBalancesFiatSumState } from '@domains/balances'
import { copyAddressToClipboard } from '@domains/common/utils'
import { useTheme } from '@emotion/react'
import { Copy, Ethereum, Eye, EyePlus, TalismanHand, Trash2, Users, Wallet, X } from '@talismn/web-icons'
import {
  Chip,
  CircularProgressIndicator,
  Hr,
  IconButton,
  ListItem,
  Menu,
  SurfaceIcon,
  Text,
  Tooltip,
} from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import { useMemo, type ReactNode } from 'react'
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import AnimatedFiatNumber from './AnimatedFiatNumber'
import RemoveWatchedAccountConfirmationDialog from './RemoveWatchedAccountConfirmationDialog'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'

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
    <SurfaceIcon size={props.size} contentColor={theme.color.primary} css={{ cursor: 'pointer' }}>
      <Users />
    </SurfaceIcon>
  )
}

const AccountsManagementMenu = (props: { button: ReactNode }) => {
  const theme = useTheme()

  const portfolioBalanceLoadable = useRecoilValueLoadable(portfolioBalancesFiatSumState)

  const setSelectedAccountAddresses = useSetRecoilState(selectedAccountAddressesState)
  const resetSelectedAccountAddresses = useResetRecoilState(selectedAccountAddressesState)
  const resetLookupAccountAddress = useResetRecoilState(lookupAccountAddressState)

  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const portfolioAccounts = useRecoilValue(portfolioAccountsState)
  const readonlyAccounts = useRecoilValue(readOnlyAccountsState)

  const getFiatBalanceLoadable = useRecoilValueLoadable(fiatBalanceGetterState)

  const leadingMenuItem = useMemo(() => {
    if (portfolioAccounts.length <= 0) {
      return (
        <Menu.Item onClick={() => setWalletConnectionSideSheetOpen(true)}>
          <ListItem
            headlineText="Connect wallet"
            leadingContent={
              <SurfaceIcon contentColor={theme.color.primary}>
                <Wallet />
              </SurfaceIcon>
            }
          />
        </Menu.Item>
      )
    }

    return (
      <Menu.Item
        onClick={() => {
          resetSelectedAccountAddresses()
          resetLookupAccountAddress()
        }}
      >
        <ListItem
          headlineText={Maybe.of(portfolioBalanceLoadable.valueMaybe()).mapOr(
            <CircularProgressIndicator size="1em" />,
            amount => (
              <AnimatedFiatNumber end={amount.total} />
            )
          )}
          overlineText="My accounts"
          leadingContent={
            <SurfaceIcon contentColor={theme.color.primary}>
              <Users />
            </SurfaceIcon>
          }
        />
      </Menu.Item>
    )
  }, [
    portfolioAccounts.length,
    portfolioBalanceLoadable,
    resetLookupAccountAddress,
    resetSelectedAccountAddresses,
    setWalletConnectionSideSheetOpen,
    theme.color.primary,
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
                    headlineText={Maybe.of(getFiatBalanceLoadable.valueMaybe()?.(x.address)).mapOr(
                      <CircularProgressIndicator size="1em" />,
                      balance => (
                        <AnimatedFiatNumber end={balance.total} />
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
                      <SurfaceIcon
                        size="3.5rem"
                        onClick={(event: any) => {
                          event.stopPropagation()
                          void copyAddressToClipboard(x.address)
                        }}
                        css={{ cursor: 'copy' }}
                      >
                        <Copy />
                      </SurfaceIcon>
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
                        headlineText={Maybe.of(getFiatBalanceLoadable.valueMaybe()?.(account.address)).mapOr(
                          <CircularProgressIndicator size="1em" />,
                          balance => (
                            <AnimatedFiatNumber end={balance.total} />
                          )
                        )}
                        overlineText={account.name ?? shortenAddress(account.address)}
                        leadingContent={<AccountIcon account={account} size="4rem" />}
                        revealTrailingContentOnHover
                        trailingContent={
                          <div css={{ display: 'flex' }}>
                            <SurfaceIcon
                              size="3.5rem"
                              onClick={(event: any) => {
                                event.stopPropagation()
                                void copyAddressToClipboard(account.address)
                              }}
                              css={{ cursor: 'copy' }}
                            >
                              <Copy />
                            </SurfaceIcon>
                            <Tooltip
                              content="This account can be managed via the extension"
                              disabled={account.origin === 'local'}
                            >
                              <div>
                                <SurfaceIcon
                                  size="3.5rem"
                                  onClick={(event: any) => {
                                    event.stopPropagation()
                                    toggleRemoveDialog()
                                  }}
                                  disabled={account.origin !== 'local'}
                                >
                                  <Trash2 />
                                </SurfaceIcon>
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
                        <SurfaceIcon>
                          <EyePlus />
                        </SurfaceIcon>
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
