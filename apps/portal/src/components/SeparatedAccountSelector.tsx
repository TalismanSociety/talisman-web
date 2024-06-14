import AccountIcon from './molecules/AccountIcon'
import { walletConnectionSideSheetOpenState } from './widgets/WalletConnectionSideSheet'
import { evmAccountsState, substrateAccountsState, type Account } from '@/domains/accounts'
import { cn } from '@/lib/utils'
import { shortenAddress } from '@/util/format'
import { type BalanceSearchQuery, type Balances } from '@talismn/balances'
import { useBalances } from '@talismn/balances-react'
import { Select, Surface } from '@talismn/ui'
import { Ethereum } from '@talismn/web-icons'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

type Props = {
  /** Selected Account Address */
  value?: string | null
  onAccountChange?: (address: string | null) => void

  accountsType?: 'substrate' | 'ethereum' | 'all'
  substrateAccountsFilter?: (account: Account) => boolean

  allowInput?: boolean
  showBalances?: {
    filter?: BalanceSearchQuery | BalanceSearchQuery[]
    output?: (addressBalances: Balances) => React.ReactNode
  }
}

const AccountRow: React.FC<{ name?: string; address: string; balance?: React.ReactNode }> = ({
  address,
  name,
  balance,
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="grid gap-[1px]">
        <p
          className={cn('!leading-none font-semibold whitespace-nowrap overflow-hidden text-ellipsis', {
            'text-[14px]': address.startsWith('0x'),
          })}
        >
          {name ?? shortenAddress(address, address.startsWith('0x') ? 6 : undefined)}
        </p>
        {name ? (
          <p className="!text-[12px] !text-gray-300 brightness-100 !leading-none">{shortenAddress(address)}</p>
        ) : null}
      </div>

      {balance}
    </div>
  )
}
export const SeparatedAccountSelector: React.FC<Props> = ({
  allowInput = false,
  onAccountChange,
  value,
  accountsType = 'substrate',
  showBalances,
  substrateAccountsFilter,
}) => {
  const evmAccounts = useRecoilValue(evmAccountsState)
  const substrateAccounts = useRecoilValue(substrateAccountsState)
  const balances = useBalances()
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)

  const filteredBalances = useMemo(() => {
    if (showBalances && showBalances.filter) return balances.find(showBalances.filter)
    return balances
  }, [showBalances, balances])

  const filteredSubstrateAccounts = useMemo(() => {
    if (!substrateAccountsFilter) return substrateAccounts
    return substrateAccounts.filter(substrateAccountsFilter)
  }, [substrateAccountsFilter, substrateAccounts])

  const selectedAccount = useMemo(() => {
    const allowedAccounts =
      accountsType === 'ethereum'
        ? evmAccounts
        : accountsType === 'substrate'
        ? filteredSubstrateAccounts
        : [...evmAccounts, ...filteredSubstrateAccounts]
    return allowedAccounts.find(account => account.address === value)
  }, [accountsType, evmAccounts, value, filteredSubstrateAccounts])

  useEffect(() => {
    if (!onAccountChange) return
    // parent has value set as unconnected account, help it set to null
    if (value && !selectedAccount && !allowInput) onAccountChange(null)
    if (accountsType === 'ethereum') {
      const evmAccount = evmAccounts[0]
      if (evmAccount && value?.toLowerCase() !== evmAccount.address.toLowerCase()) onAccountChange(evmAccount.address)
    } else if (accountsType === 'substrate') {
      if (filteredSubstrateAccounts.length > 0 && !filteredSubstrateAccounts.find(a => a.address === value)) {
        const defaultSubstrateAccount = filteredSubstrateAccounts[0]
        if (defaultSubstrateAccount) onAccountChange(defaultSubstrateAccount.address)
      }
    }
  }, [onAccountChange, value, selectedAccount, allowInput, accountsType, evmAccounts, filteredSubstrateAccounts])

  if (accountsType === 'ethereum') {
    const evmAccount = evmAccounts[0]
    return (
      <Surface className="[&>p]:text-[14px] p-[12px] rounded-[8px] mt-[9px]">
        {evmAccount ? (
          <div className="flex items-center gap-[10px]">
            <AccountIcon account={{ address: evmAccount.address }} size="32px" />
            <AccountRow
              address={evmAccount.address}
              name={evmAccount.name}
              balance={
                showBalances
                  ? showBalances.output?.(
                      filteredBalances.find(b => b.address.toLowerCase() === evmAccount.address.toLowerCase())
                    ) ?? null
                  : null
              }
            />
          </div>
        ) : (
          <p>Please connect Ethereum account first.</p>
        )}
      </Surface>
    )
  }

  return (
    <Select
      className="w-full [&>button]:!py-[12px] [&>button]:!rounded-[8px] [&>button>div]:w-full mt-[8px]"
      placeholder="Select an account"
      value={value}
      onChangeValue={onAccountChange}
    >
      {accountsType !== 'substrate' && (
        <Surface>
          {accountsType === 'all' && (
            <div className="px-[12px]">
              <p className="text-gray-400 text-[12px]">Ethereum Accounts</p>
            </div>
          )}
          {evmAccounts.length > 0 &&
            evmAccounts.map(account => (
              <Select.Option
                leadingIcon={<AccountIcon account={{ address: account.address }} size="32px" />}
                headlineContent={
                  <AccountRow
                    address={account.address}
                    name={account.name}
                    balance={
                      showBalances
                        ? showBalances.output?.(
                            filteredBalances.find(b => b.address.toLowerCase() === account.address.toLowerCase())
                          ) ?? null
                        : null
                    }
                  />
                }
                key={account.address}
                value={account.address}
                className="!w-full [&>div]:w-full"
              />
            ))}
          {evmAccounts.length === 0 && (
            <div
              className="!w-full !rounded-none p-[12px] py-[8px] mt-[4px] flex items-center gap-[4px] cursor-pointer group hover:bg-gray-700"
              onClick={() => {
                setWalletConnectionSideSheetOpen(true)
              }}
            >
              <div className="w-[32px] h-[32px] flex items-center justify-center">
                <Ethereum className="text-gray-400 group-hover:text-white " size={16} />
              </div>
              <p className="text-gray-400 group-hover:text-white text-[14px]">Connect Ethereum Wallet</p>
            </div>
          )}
        </Surface>
      )}
      <div>
        {accountsType === 'all' && (
          <div className="px-[12px] mt-[8px]">
            <p className="text-gray-400 text-[12px]">Polkadot Accounts</p>
          </div>
        )}
        {filteredSubstrateAccounts.length > 0 ? (
          filteredSubstrateAccounts.map(account => (
            <Select.Option
              leadingIcon={<AccountIcon account={{ address: account.address }} size="32px" />}
              headlineContent={
                <AccountRow
                  address={account.address}
                  name={account.name}
                  balance={
                    showBalances
                      ? showBalances.output?.(filteredBalances.find(b => b.address === account.address)) ?? null
                      : null
                  }
                />
              }
              className="!w-full [&>div]:w-full"
              key={account.address}
              value={account.address}
            />
          ))
        ) : (
          <div className="px-[12px] pb-[16px]">
            <p className="text-[14px]">No Polkadot account found.</p>
          </div>
        )}
      </div>
    </Select>
  )
}
