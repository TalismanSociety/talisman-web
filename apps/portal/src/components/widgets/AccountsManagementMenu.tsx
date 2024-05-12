import {
  lookupAccountAddressState,
  portfolioAccountsState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
  selectedAccountsState,
} from '../../domains/accounts/recoils'
import { fiatBalanceGetterState, portfolioBalancesFiatSumState } from '../../domains/balances'
import { copyAddressToClipboard } from '../../domains/common/utils'
import { useOnChainId } from '../../libs/onChainId/hooks/useOnChainId'
import { shortenAddress } from '../../util/format'
import { Maybe } from '../../util/monads'
import AccountIcon from '../molecules/AccountIcon/AccountIcon'
import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'
import AnimatedFiatNumber from './AnimatedFiatNumber'
import RemoveWatchedAccountConfirmationDialog from './RemoveWatchedAccountConfirmationDialog'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'
import { useTheme } from '@emotion/react'
import { Chip, CircularProgressIndicator, Hr, IconButton, Menu, SurfaceIcon, Text, Tooltip } from '@talismn/ui'
import { Copy, Ethereum, Eye, EyePlus, TalismanHand, Trash2, Users, Wallet, X } from '@talismn/web-icons'
import { useMemo, type ReactNode } from 'react'
import { useRecoilValue, useRecoilValueLoadable, useResetRecoilState, useSetRecoilState } from 'recoil'

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

const AccountsManagementAddress = ({
  name,
  address,
  showOnChainId,
}: {
  name?: string
  address: string
  showOnChainId?: boolean
}) => {
  const theme = useTheme()
  const [onChainId] = useOnChainId(address)

  return (
    <>
      {onChainId && (
        <div css={{ display: showOnChainId ? 'block' : 'none', color: theme.color.primary }}>{onChainId}</div>
      )}
      <div css={{ display: onChainId && showOnChainId ? 'none' : 'block' }}>{name ?? shortenAddress(address)}</div>
    </>
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
        <Menu.Item.Button
          headlineContent="Connect wallet"
          leadingContent={
            <SurfaceIcon contentColor={theme.color.primary}>
              <Wallet />
            </SurfaceIcon>
          }
          onClick={() => setWalletConnectionSideSheetOpen(true)}
        />
      )
    }

    return (
      <Menu.Item.Button
        headlineContent={Maybe.of(portfolioBalanceLoadable.valueMaybe()).mapOr(
          <CircularProgressIndicator size="1em" />,
          amount => (
            <AnimatedFiatNumber end={amount.total} />
          )
        )}
        overlineContent="My accounts"
        leadingContent={
          <SurfaceIcon contentColor={theme.color.primary}>
            <Users />
          </SurfaceIcon>
        }
        onClick={() => {
          resetSelectedAccountAddresses()
          resetLookupAccountAddress()
        }}
      />
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
                <Menu.Item.Button
                  key={index}
                  headlineContent={Maybe.of(getFiatBalanceLoadable.valueMaybe()?.(x.address)).mapOr(
                    <CircularProgressIndicator size="1em" />,
                    balance => (
                      <AnimatedFiatNumber end={balance.total} />
                    )
                  )}
                  overlineContent={({ hover }) => (
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
                      <AccountsManagementAddress name={x.name} address={x.address} showOnChainId={hover} />
                      {x.canSignEvm && <EvmChip />}
                    </div>
                  )}
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
                  onClick={() => setSelectedAccountAddresses(() => [x.address])}
                />
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
                    <Menu.Item.Button
                      headlineContent={Maybe.of(getFiatBalanceLoadable.valueMaybe()?.(account.address)).mapOr(
                        <CircularProgressIndicator size="1em" />,
                        balance => (
                          <AnimatedFiatNumber end={balance.total} />
                        )
                      )}
                      overlineContent={({ hover }) => (
                        <AccountsManagementAddress
                          name={account.name}
                          address={account.address}
                          showOnChainId={hover}
                        />
                      )}
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
                      onClick={() => setSelectedAccountAddresses(() => [account.address])}
                    />
                  )}
                </RemoveWatchedAccountConfirmationDialog>
              ))}
              <AddReadOnlyAccountDialog>
                {({ onToggleOpen }) => (
                  <Menu.Item.Button
                    headlineContent="Follow account"
                    leadingContent={
                      <SurfaceIcon>
                        <EyePlus />
                      </SurfaceIcon>
                    }
                    onClick={onToggleOpen}
                    dismissAfterSelection={false}
                  />
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
