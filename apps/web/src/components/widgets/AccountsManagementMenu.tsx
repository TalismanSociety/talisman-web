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
import { useTheme } from '@emotion/react'
import { motion } from 'framer-motion'
import { useCallback } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const AnimatedChevron = motion(ChevronDown)

const AccountsManagementMenu = () => {
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
        <section css={{ width: '32rem' }}>
          <Text.Body as="header" alpha="high" css={{ marginBottom: '1.6rem' }}>
            Select account
          </Text.Body>
          <section css={{ marginBottom: '1.6rem' }}>
            <Text.Body as="header" css={{ fontWeight: 'bold', marginBottom: '1.6rem' }}>
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
                css={{ paddingRight: 0, paddingLeft: 0 }}
              />
            </Menu.Item>
            {injectedAccounts.map(x => (
              <Menu.Item onClick={() => setSelectedAccountAddresses(() => [x.address])}>
                <ListItem
                  headlineText={x.name ?? x.address}
                  overlineText="$356,120.32"
                  leadingContent={<Identicon value={x.address} size="4rem" />}
                  css={{ paddingRight: 0, paddingLeft: 0 }}
                />
              </Menu.Item>
            ))}
          </section>
          <section>
            <Text.Body as="header" css={{ fontWeight: 'bold', marginBottom: '1.6rem' }}>
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
                  css={{ paddingRight: 0, paddingLeft: 0 }}
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
                css={{ paddingRight: 0, paddingLeft: 0 }}
              />
            </Menu.Item>
          </section>
        </section>
      </Menu.Items>
    </Menu>
  )
}

export default AccountsManagementMenu
