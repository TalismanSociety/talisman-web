import { type Account } from '../../domains/accounts/recoils'
import { useHasActiveWalletConnection } from '../../domains/extension'
import { shortenAddress } from '../../util/format'
import AccountIcon from '../molecules/AccountIcon/AccountIcon'
import { walletConnectionSideSheetOpenState } from './WalletConnectionSideSheet'
import { useBalances } from '@talismn/balances-react'
import { Button, CircularProgressIndicator, Select } from '@talismn/ui'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { usePrevious } from 'react-use'
import { useSetRecoilState } from 'recoil'

export type AccountSelectorProps = {
  width?: number | string
  accounts: Account[]
  selectedAccount?: Account | string
  onChangeSelectedAccount: (account: Account | undefined) => unknown
  inTransition?: boolean
  withBalance?: boolean
}

const AccountSelector = (props: AccountSelectorProps) => {
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const hasActiveWalletConnection = useHasActiveWalletConnection()
  const balances = useBalances()
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
      className="w-full [&>button]:!py-[12px] [&>button]:!rounded-[8px] [&>button>div]:w-full mt-[8px]"
      placeholder={<Select.Option headlineContent="Select an account" />}
      value={selectedValue}
      onChangeValue={onChangeAccount}
      renderSelected={
        props.inTransition
          ? address => {
              const selectedAccount = props.accounts.find(x => x.address === address)
              return (
                <Select.Option
                  className=""
                  leadingIcon={<CircularProgressIndicator size="4rem" />}
                  supportingContent={
                    selectedAccount && selectedAccount.name ? shortenAddress(selectedAccount.address) : ''
                  }
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
          leadingIcon={<AccountIcon account={x} size="32px" />}
          className="!w-full [&>div]:w-full"
          headlineContent={
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="!leading-none !mb-[4px] font-semibold">{x.name ?? shortenAddress(x.address)}</p>
                {x.name ? (
                  <p className="!text-[12px] !text-gray-300 brightness-100 !leading-none">
                    {shortenAddress(x.address)}
                  </p>
                ) : null}
              </div>

              {props.withBalance ? (
                <p className="text-gray-400 text-[14px]">
                  $
                  {balances
                    .find(q => q.address === x.address)
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

  return [
    [accounts.find(x => x.address === account?.address && x.origin === account?.origin), setAccount] as const,
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

export default AccountSelector
