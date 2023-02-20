import Button from '@components/atoms/Button'
import { ChevronDown, Download, Eye, Link, PlusCircle, Trash2, Union, Users } from '@components/atoms/Icon'
import IconButton from '@components/atoms/IconButton'
import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import ListItem from '@components/molecules/ListItem'
import Menu from '@components/molecules/Menu'
import {
  injectedAccountsState,
  legacySelectedAccountState,
  readOnlyAccountsState,
  selectedAccountAddressesState,
} from '@domains/accounts/recoils'
import { fiatBalancesState, totalLocalizedFiatBalanceState } from '@domains/balances/recoils'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { useTheme } from '@emotion/react'
import { isWeb3Injected } from '@polkadot/extension-dapp'
import getDownloadLink from '@util/getDownloadLink'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import AddReadOnlyAccountDialog from './AddReadOnlyAccountDialog'

const AnimatedChevron = motion(ChevronDown)

const AccountsManagementMenu = () => {
  const theme = useTheme()

  const totalBalance = useRecoilValue(totalLocalizedFiatBalanceState)

  const setSelectedAccountAddresses = useSetRecoilState(selectedAccountAddressesState)
  const selectedAccount = useRecoilValue(legacySelectedAccountState)
  const injectedAccounts = useRecoilValue(injectedAccountsState)
  const [readonlyAccounts, setReadonlyAccounts] = useRecoilState(readOnlyAccountsState)

  const fiatBalances = useRecoilValue(fiatBalancesState)

  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)

  const [buttonIcon, buttonText] = useMemo(() => {
    if ((!isWeb3Injected || !allowExtensionConnection) && readonlyAccounts.length === 0) {
      return [
        <IconButton size="2.4rem" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
          <Link />
        </IconButton>,
        'Connect',
      ]
    }

    if (selectedAccount === undefined) {
      return [
        <IconButton size="2.4rem" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
          <Users />
        </IconButton>,
        'All accounts',
      ]
    }

    return [
      <Identicon value={selectedAccount.address} size="2.4rem" />,
      selectedAccount.name ?? selectedAccount.address,
    ]
  }, [allowExtensionConnection, readonlyAccounts.length, selectedAccount, theme.color.foreground, theme.color.primary])

  const leadingMenuItem = useMemo(() => {
    if (!isWeb3Injected) {
      return (
        <Menu.Item>
          <Button as="a" variant="noop" href={getDownloadLink()} target="_blank">
            <ListItem
              leadingContent={
                <IconButton containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                  <Download />
                </IconButton>
              }
              headlineText="Install wallet"
            />
          </Button>
        </Menu.Item>
      )
    }

    if (!allowExtensionConnection) {
      return (
        <Menu.Item onClick={() => setAllowExtensionConnection(true)}>
          <ListItem
            leadingContent={
              <IconButton containerColor={theme.color.foreground} contentColor={theme.color.primary}>
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
          overlineText={totalBalance}
          leadingContent={
            <IconButton containerColor={theme.color.foreground} contentColor={theme.color.primary}>
              <Users />
            </IconButton>
          }
        />
      </Menu.Item>
    )
  }, [
    allowExtensionConnection,
    setAllowExtensionConnection,
    setSelectedAccountAddresses,
    theme.color.foreground,
    theme.color.primary,
    totalBalance,
  ])

  return (
    <Menu>
      <Menu.Button>
        <Button
          variant="secondary"
          leadingIcon={buttonIcon}
          trailingIcon={<AnimatedChevron variants={{ true: { transform: 'rotate(180deg)' }, false: {} }} />}
          css={{ width: '25rem' }}
        >
          {buttonText}
        </Button>
      </Menu.Button>
      <Menu.Items>
        <section css={{ width: '34rem' }}>
          <Text.Body as="header" alpha="high" css={{ margin: '1.6rem 0', padding: '0 1.6rem' }}>
            Select account
          </Text.Body>
          <section css={{ marginBottom: '1.6rem' }}>
            <Text.Body as="header" css={{ fontWeight: 'bold', marginBottom: '1.6rem', padding: '0 1.6rem' }}>
              <Union width="1em" height="1em" /> My accounts
            </Text.Body>
            {leadingMenuItem}
            {injectedAccounts.map(x => (
              <Menu.Item onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? x.address}
                  overlineText={fiatBalances[x.address]?.toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'usd',
                    currencyDisplay: 'narrowSymbol',
                  })}
                  leadingContent={<Identicon value={x.address} size="4rem" />}
                />
              </Menu.Item>
            ))}
          </section>
          <section>
            <Text.Body as="header" css={{ fontWeight: 'bold', padding: '1.6rem' }}>
              <Eye width="1em" height="1em" /> Watched accounts
            </Text.Body>
            {readonlyAccounts.map(x => (
              <Menu.Item onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? x.address}
                  overlineText={fiatBalances[x.address]?.toLocaleString(undefined, {
                    style: 'currency',
                    currency: 'usd',
                    currencyDisplay: 'narrowSymbol',
                  })}
                  leadingContent={<Identicon value={x.address} size="4rem" />}
                  trailingContent={
                    <IconButton
                      onClick={event => {
                        event.stopPropagation()
                        setReadonlyAccounts(y => y.filter(z => z.address !== x.address))
                      }}
                    >
                      <Trash2 />
                    </IconButton>
                  }
                />
              </Menu.Item>
            ))}
            <AddReadOnlyAccountDialog>
              {({ onToggleOpen }) => (
                <Menu.Item onClick={onToggleOpen} dismissAfterSelection={false}>
                  <ListItem
                    headlineText="Add watch only address"
                    leadingContent={
                      <IconButton>
                        <Eye />
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

export default AccountsManagementMenu
