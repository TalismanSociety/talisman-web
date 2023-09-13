import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
import { type Account } from '@domains/accounts/recoils'
import { useIsWeb3Injected } from '@domains/extension/hooks'
import { allowExtensionConnectionState } from '@domains/extension/recoils'
import { Download } from '@talismn/icons'
import { Button, CircularProgressIndicator, Select } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { usePrevious } from 'react-use'
import { useRecoilState } from 'recoil'

export type AccountSelectorProps = {
  width?: number | string
  accounts: Account[]
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
  inTransition?: boolean
}

const AccountSelector = (props: AccountSelectorProps) => {
  const onChange = useCallback(
    (address: string | undefined) => props.onChangeSelectedAccount(props.accounts.find(x => x.address === address)),
    [props]
  )

  const [allowExtensionConnection, setAllowExtensionConnection] = useRecoilState(allowExtensionConnectionState)

  if (!useIsWeb3Injected()) {
    return (
      <Button
        as="a"
        href="https://talisman.xyz/download"
        target="_blank"
        trailingIcon={<Download />}
        css={{ width: 'auto' }}
      >
        Install wallet
      </Button>
    )
  }

  if (!allowExtensionConnection) {
    return (
      <Button onClick={() => setAllowExtensionConnection(true)} css={{ width: 'auto' }}>
        Connect wallet
      </Button>
    )
  }

  const selectedValue =
    typeof props.selectedAccount === 'string' ? props.selectedAccount : props.selectedAccount?.address

  return (
    <Select
      css={{ width: '100%' }}
      placeholder="Select an account"
      value={selectedValue}
      onChange={onChange}
      renderSelected={
        props.inTransition
          ? address => {
              const selectedAccount = props.accounts.find(x => x.address === address)
              return (
                <Select.Option
                  leadingIcon={<CircularProgressIndicator size="4rem" />}
                  headlineText={
                    selectedAccount === undefined ? '' : selectedAccount.name ?? shortenAddress(selectedAccount.address)
                  }
                />
              )
            }
          : undefined
      }
    >
      {props.accounts.map(x => (
        <Select.Option
          key={x.address}
          value={x.address}
          leadingIcon={<AccountIcon account={x} size="4rem" />}
          headlineText={x.name ?? shortenAddress(x.address)}
        />
      ))}
    </Select>
  )
}

export const useAccountSelector = (
  accounts: Account[],
  initialAccount?: Account | number | ((accounts?: Account[]) => Account | undefined),
  accountSelectorProps?: Omit<AccountSelectorProps, 'accounts' | 'selectedAccount' | 'onChangeSelectedAccount'>
) => {
  const [inTransition, startTransition] = useTransition()

  const getInitialAccount = useCallback(
    (accounts: Account[]) =>
      typeof initialAccount === 'function'
        ? initialAccount(accounts)
        : typeof initialAccount === 'number'
        ? accounts.at(initialAccount)
        : initialAccount,
    [initialAccount]
  )

  const [account, setAccount] = useState(getInitialAccount(accounts))

  const previousAccounts = usePrevious(accounts)
  const accountsUpdated = useMemo(
    () => JSON.stringify(previousAccounts) !== JSON.stringify(accounts),
    [accounts, previousAccounts]
  )

  useEffect(() => {
    if (accountsUpdated || (account === undefined && accounts.length > 0)) {
      setAccount(getInitialAccount(accounts))
    }
  }, [account, accounts, accountsUpdated, getInitialAccount])

  return [
    account,
    // eslint-disable-next-line react/jsx-key
    <AccountSelector
      {...accountSelectorProps}
      accounts={accounts}
      selectedAccount={account}
      onChangeSelectedAccount={account => startTransition(() => setAccount(account))}
      inTransition={inTransition}
    />,
    inTransition,
  ] as const
}

export default AccountSelector
