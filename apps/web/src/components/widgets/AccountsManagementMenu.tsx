import Button from '@components/atoms/Button'
import { ChevronDown, Eye, Trash2, Union, Users } from '@components/atoms/Icon'
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
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { useTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const AnimatedChevron = motion(ChevronDown)

const AccountsManagement = () => {
  const theme = useTheme()

  const setSelectedAccountAddresses = useSetRecoilState(selectedAccountAddressesState)
  const selectedAccount = useRecoilValue(legacySelectedAccountState)
  const injectedAccounts = useRecoilValue(injectedAccountsState)
  const [readonlyAccounts, setReadonlyAccounts] = useRecoilState(readOnlyAccountsState)

  return (
    <Menu>
      <Menu.Button>
        <Button
          variant="secondary"
          leadingIcon={
            selectedAccount === undefined ? (
              <IconButton size="2.4rem" containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                <Users />
              </IconButton>
            ) : (
              <Identicon value={selectedAccount.address} size="2.4rem" />
            )
          }
          trailingIcon={<AnimatedChevron variants={{ true: { transform: 'rotate(180deg)' }, false: {} }} />}
          css={{ width: '25rem' }}
        >
          {selectedAccount === undefined ? 'All accounts' : selectedAccount.name ?? selectedAccount.address}
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
            <Menu.Item
              onClick={useCallback(() => setSelectedAccountAddresses(undefined), [setSelectedAccountAddresses])}
            >
              <ListItem
                headlineText="All accounts"
                overlineText="$356,120.32"
                leadingContent={
                  <IconButton containerColor={theme.color.foreground} contentColor={theme.color.primary}>
                    <Users />
                  </IconButton>
                }
              />
            </Menu.Item>
            {injectedAccounts.map(x => (
              <Menu.Item onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? x.address}
                  overlineText="$356,120.32"
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
                  headlineText="Polkadot.js import"
                  overlineText="$356,120.32"
                  leadingContent={<Identicon value={x.address} size="4rem" />}
                  trailingContent={
                    <IconButton onClick={() => setReadonlyAccounts(y => y.filter(z => z.address !== x.address))}>
                      <Trash2 />
                    </IconButton>
                  }
                />
              </Menu.Item>
            ))}
            <Menu.Item>
              <ListItem
                headlineText="Add watch only address"
                leadingContent={
                  <IconButton>
                    <Eye />
                  </IconButton>
                }
              />
            </Menu.Item>
          </section>
        </section>
      </Menu.Items>
    </Menu>
  )
}

export const ConnectButton = () => {
  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)
  const { t } = useTranslation()

  if (allowExtensionConnection) {
    return null
  }

  return <Button onClick={() => setAllowExtensionConnection(true)}>{t('Connect')}</Button>
}

const AccountsManagementMenu = () => {
  const allowExtensionConnection = useRecoilValue(allowExtensionConnectionState)

  return allowExtensionConnection ? <AccountsManagement /> : <ConnectButton />
}

export default AccountsManagementMenu
