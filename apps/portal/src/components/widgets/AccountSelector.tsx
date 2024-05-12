import AccountIcon from '../molecules/AccountIcon/AccountIcon'
import { type Account } from '../../domains/accounts/recoils'
import { useHasActiveWalletConnection } from '../../domains/extension'
import { Button, CircularProgressIndicator, Identicon, Select } from '@talismn/ui'
import { shortenAddress } from '../../util/format'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { usePrevious } from 'react-use'
import { useSetRecoilState } from 'recoil'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'

export type AccountSelectorProps = {
  width?: number | string
  accounts: Account[]
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
  inTransition?: boolean
}

const AccountSelector = (props: AccountSelectorProps) => {
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const hasActiveWalletConnection = useHasActiveWalletConnection()

  const onChangeAccount = useCallback(
    (address: string | undefined) => props.onChangeSelectedAccount(props.accounts.find(x => x.address === address)),
    [props]
  )

  if (!hasActiveWalletConnection) {
    return (
      <Button onClick={() => setWalletConnectionSideSheetOpen(true)} css={{ width: '100%' }}>
        Connect wallet
      </Button>
    )
  }

  const selectedValue =
    typeof props.selectedAccount === 'string' ? props.selectedAccount : props.selectedAccount?.address

  return (
    <Select
      css={{ width: '100%' }}
      placeholder={
        <Select.Option
          leadingIcon={
            <Identicon value="placeholder" size="4em" css={{ visibility: 'hidden', pointerEvents: 'none', width: 0 }} />
          }
          headlineContent="Select an account"
        />
      }
      value={selectedValue}
      onChangeValue={onChangeAccount}
      renderSelected={
        props.inTransition
          ? address => {
              const selectedAccount = props.accounts.find(x => x.address === address)
              return (
                <Select.Option
                  leadingIcon={<CircularProgressIndicator size="4rem" />}
                  headlineContent={
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
          headlineContent={x.name ?? shortenAddress(x.address)}
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

  const [account, setAccount] = useState<Account | undefined>(getInitialAccount(accounts))

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
    [account, setAccount] as const,
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
