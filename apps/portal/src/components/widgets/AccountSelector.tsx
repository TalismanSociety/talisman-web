import { useBalances } from '@talismn/balances-react'
import { Button } from '@talismn/ui/atoms/Button'
import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { Select } from '@talismn/ui/molecules/Select'
import { encodeAnyAddress } from '@talismn/util'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { usePrevious } from 'react-use'
import { useSetRecoilState } from 'recoil'

import { AccountIcon } from '@/components/molecules/AccountIcon'
import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { type Account } from '@/domains/accounts/recoils'
import { useHasActiveWalletConnection } from '@/domains/extension'
import { shortenAddress } from '@/util/shortenAddress'

export type AccountSelectorProps = {
  accounts: Account[]
  prefix?: number
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
  inTransition?: boolean
  withBalance?: boolean
}

export const AccountSelector = ({
  accounts,
  prefix = 42,
  selectedAccount,
  onChangeSelectedAccount,
  inTransition,
  withBalance,
}: AccountSelectorProps) => {
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const hasActiveWalletConnection = useHasActiveWalletConnection()
  const balances = useBalances()
  const onChangeAccount = useCallback(
    (address: string | undefined) =>
      onChangeSelectedAccount(
        address ? accounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(address)) : undefined
      ),
    [accounts, onChangeSelectedAccount]
  )

  if (!hasActiveWalletConnection) {
    return (
      <Button onClick={() => setWalletConnectionSideSheetOpen(true)} css={{ width: '100%' }}>
        Connect wallet
      </Button>
    )
  }

  const selectedValue = typeof selectedAccount === 'string' ? selectedAccount : selectedAccount?.address

  return (
    <Select
      className="mt-[8px] w-full [&>button>div]:w-full [&>button]:!rounded-[8px] [&>button]:!py-[12px]"
      placeholder={<Select.Option headlineContent="Select an account" />}
      value={selectedValue}
      onChangeValue={onChangeAccount}
      renderSelected={
        inTransition
          ? address => {
              const selectedAccount = address
                ? accounts.find(x => encodeAnyAddress(x.address) === encodeAnyAddress(address))
                : undefined
              return (
                <Select.Option
                  leadingIcon={<CircularProgressIndicator size="4rem" />}
                  supportingContent={
                    selectedAccount && selectedAccount.name
                      ? shortenAddress(encodeAnyAddress(selectedAccount.address, prefix))
                      : ''
                  }
                  headlineContent={
                    selectedAccount
                      ? selectedAccount.name ?? shortenAddress(encodeAnyAddress(selectedAccount.address, prefix))
                      : ''
                  }
                />
              )
            }
          : undefined
      }
    >
      {accounts.map(x => (
        <Select.Option
          key={encodeAnyAddress(x.address, prefix)}
          value={encodeAnyAddress(x.address, prefix)}
          leadingIcon={<AccountIcon account={x} size="32px" />}
          className="!w-full [&>div]:w-full"
          headlineContent={
            <div className="flex w-full items-center justify-between">
              <div className="overflow-hidden">
                <p className="!mb-[4px] truncate font-semibold !leading-none">
                  {x.name ?? shortenAddress(encodeAnyAddress(x.address, prefix))}
                </p>
                {x.name ? (
                  <p className="truncate !text-[12px] !leading-none !text-gray-300 brightness-100">
                    {shortenAddress(encodeAnyAddress(x.address, prefix))}
                  </p>
                ) : null}
              </div>

              {withBalance ? (
                <p className="text-[14px] text-gray-400">
                  $
                  {balances
                    .find(q => encodeAnyAddress(q.address) === encodeAnyAddress(x.address))
                    .sum.fiat('usd')
                    .transferable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              ) : null}
            </div>
          }
        />
      ))}
    </Select>
  )
}

export const useAccountSelector = (
  accounts: Account[],
  initialAccount?: Account | number | ((accounts?: Account[]) => Account | undefined),
  accountSelectorProps?: Omit<AccountSelectorProps, 'accounts' | 'selectedAccount' | 'onChangeSelectedAccount'>,
  withToken?: boolean
) => {
  // TODO: remove this
  const [inTransition] = useTransition()

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

  const selectedAccount = account
    ? accounts.find(
        x => encodeAnyAddress(x.address) === encodeAnyAddress(account.address) && x.origin === account.origin
      )
    : undefined

  return [
    [selectedAccount, setAccount] as const,
    // eslint-disable-next-line react/jsx-key
    <AccountSelector
      {...accountSelectorProps}
      accounts={accounts}
      selectedAccount={account}
      onChangeSelectedAccount={setAccount}
      inTransition={inTransition}
      withBalance={withToken}
    />,
    inTransition,
  ] as const
}
