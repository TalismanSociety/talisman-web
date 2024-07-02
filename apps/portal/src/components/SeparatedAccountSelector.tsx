import AccountIcon from './molecules/AccountIcon'
import { walletConnectionSideSheetOpenState } from './widgets/WalletConnectionSideSheet'
import { evmAccountsState, substrateAccountsState, type Account } from '@/domains/accounts'
import { cn } from '@/lib/utils'
import { shortenAddress } from '@/util/format'
import { isAddress as isSubstrateAddress, decodeAddress, encodeAddress } from '@polkadot/util-crypto'
import { type BalanceSearchQuery, type Balances } from '@talismn/balances'
import { useBalances } from '@talismn/balances-react'
import { Select, Surface } from '@talismn/ui'
import { Ethereum } from '@talismn/web-icons'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isAddress } from 'viem'

type Props = {
  allowInput?: boolean
  accountsType?: 'substrate' | 'ethereum' | 'all'
  /** Selected Account Address */
  onAccountChange?: (address: string | null) => void
  evmAccountsFilter?: (account: Account) => boolean
  showBalances?: {
    filter?: BalanceSearchQuery | BalanceSearchQuery[]
    output?: (address: string, addressBalances: Balances) => React.ReactNode
  }
  substrateAccountsFilter?: (account: Account) => boolean
  substrateAccountPrefix?: number
  value?: string | null
}

const AccountRow: React.FC<{
  name?: string
  address: string
  balance?: React.ReactNode
  substrateAccountPrefix?: number
}> = ({ address, name, balance, substrateAccountPrefix }) => {
  const formattedAddress = useMemo(() => {
    if (address.startsWith('0x') || substrateAccountPrefix === undefined) return address
    return encodeAddress(decodeAddress(address), substrateAccountPrefix)
  }, [address, substrateAccountPrefix])

  return (
    <div className="flex items-center justify-between w-full">
      <div className="grid gap-[1px]">
        <p
          className={cn('!leading-none font-semibold whitespace-nowrap overflow-hidden text-ellipsis', {
            'text-[14px]': formattedAddress.startsWith('0x'),
          })}
        >
          {name ?? shortenAddress(formattedAddress, 6)}
        </p>
        {name ? (
          <p className="!text-[12px] !text-gray-300 brightness-100 !leading-none mt-[2px]">
            {shortenAddress(formattedAddress, 6)}
          </p>
        ) : null}
      </div>

      {balance}
    </div>
  )
}
export const SeparatedAccountSelector: React.FC<Props> = ({
  accountsType = 'substrate',
  allowInput = false,
  onAccountChange,
  showBalances,
  evmAccountsFilter,
  substrateAccountsFilter,
  substrateAccountPrefix,
  value,
}) => {
  const defaultEvmAccounts = useRecoilValue(evmAccountsState)
  const defaultSubstrateAccounts = useRecoilValue(substrateAccountsState)
  const balances = useBalances()
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const [query, setQuery] = useState('')

  const filteredBalances = useMemo(() => {
    if (showBalances && showBalances.filter) return balances.find(showBalances.filter)
    return balances
  }, [showBalances, balances])

  const accountFromInput = useMemo((): Account | null => {
    if (!allowInput) return null
    if (isAddress(query))
      return {
        address: query,
        type: 'ethereum',
        partOfPortfolio: false,
        readonly: true,
      }
    if (isSubstrateAddress(query))
      return {
        // computation will always be done in generic format
        address: encodeAddress(decodeAddress(query), 42),
        type: 'sr25519',
        partOfPortfolio: false,
        readonly: true,
      }
    return null
  }, [allowInput, query])

  const evmAccounts = useMemo(() => {
    const filtered = evmAccountsFilter ? defaultEvmAccounts.filter(evmAccountsFilter) : defaultEvmAccounts
    if (
      accountFromInput?.type !== 'ethereum' ||
      filtered.find(a => a.address.toLowerCase() === accountFromInput.address.toLowerCase())
    )
      return filtered
    return [accountFromInput, ...filtered]
  }, [accountFromInput, defaultEvmAccounts, evmAccountsFilter])

  const substrateAccounts = useMemo(() => {
    const filtered = substrateAccountsFilter
      ? defaultSubstrateAccounts.filter(substrateAccountsFilter)
      : defaultSubstrateAccounts
    if (
      !accountFromInput ||
      accountFromInput?.type === 'ethereum' ||
      filtered.find(a => a.address.toLowerCase() === accountFromInput.address.toLowerCase())
    )
      return filtered
    return [accountFromInput, ...filtered]
  }, [accountFromInput, substrateAccountsFilter, defaultSubstrateAccounts])

  const queriedEvmAccounts = useMemo(() => {
    if (query.trim() === '') return evmAccounts
    return evmAccounts.filter(
      account =>
        account.address?.toLowerCase().includes(query.toLowerCase()) ||
        account.name?.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, evmAccounts])

  const queriedSubstrateAccounts = useMemo(() => {
    if (query.trim() === '') return substrateAccounts
    return substrateAccounts.filter(
      account =>
        account.address?.toLowerCase().includes(query.toLowerCase()) ||
        encodeAddress(decodeAddress(account.address), substrateAccountPrefix)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        account.name?.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, substrateAccountPrefix, substrateAccounts])

  const selectedAccount = useMemo(() => {
    const allowedAccounts =
      accountsType === 'ethereum'
        ? evmAccounts
        : accountsType === 'substrate'
        ? substrateAccounts
        : [...evmAccounts, ...substrateAccounts]
    return allowedAccounts.find(account => account.address === value)
  }, [accountsType, evmAccounts, value, substrateAccounts])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!allowInput) return
      e.preventDefault()
      e.stopPropagation()
      setQuery(e.target.value)
    },
    [setQuery, allowInput]
  )

  // selected account is invalid, clear it
  useEffect(() => {
    if (!selectedAccount && value) {
      onAccountChange?.(null)
      setQuery('')
    }
  }, [onAccountChange, selectedAccount, value])

  if (accountsType === 'ethereum' && !allowInput) {
    const evmAccount = evmAccounts[0]
    return (
      <Surface className="[&>p]:text-[14px] p-[12px] rounded-[8px] mt-[9px]">
        {evmAccount ? (
          <div className="flex items-center gap-[10px]">
            <AccountIcon account={{ address: evmAccount.address }} size="32px" />
            <AccountRow
              substrateAccountPrefix={substrateAccountPrefix}
              address={evmAccount.address}
              name={evmAccount.name}
              balance={
                showBalances
                  ? showBalances.output?.(
                      evmAccount.address,
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
      placeholder={allowInput ? 'Enter or select an address' : 'Select an account'}
      value={value}
      onChangeValue={val => {
        onAccountChange?.(val ?? null)
        if (!val) setQuery('')
      }}
      allowInput={allowInput}
      clearRequired={allowInput}
      onInputChange={handleInputChange}
      inputValue={query}
    >
      {accountsType !== 'substrate' && (
        <Surface>
          {accountsType === 'all' && (
            <div className="px-[12px]">
              <p className="text-gray-400 text-[12px]">Ethereum Accounts</p>
            </div>
          )}
          {evmAccounts.length > 0 ? (
            queriedEvmAccounts.length > 0 ? (
              queriedEvmAccounts.map(account => (
                <Select.Option
                  leadingIcon={<AccountIcon account={{ address: account.address }} size="32px" />}
                  headlineContent={
                    <AccountRow
                      substrateAccountPrefix={substrateAccountPrefix}
                      address={account.address}
                      name={account.name}
                      balance={
                        showBalances
                          ? showBalances.output?.(
                              account.address,
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
              ))
            ) : (
              <div className="px-[12px] pb-[16px]">
                <p className="text-[14px]">No Ethereum account found.</p>
              </div>
            )
          ) : (
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
      {accountsType !== 'ethereum' && (
        <div>
          {accountsType === 'all' && (
            <div className="px-[12px] mt-[8px]">
              <p className="text-gray-400 text-[12px]">Polkadot Accounts</p>
            </div>
          )}
          {queriedSubstrateAccounts.length > 0 ? (
            queriedSubstrateAccounts.map(account => (
              <Select.Option
                leadingIcon={<AccountIcon account={{ address: account.address }} size="32px" />}
                headlineContent={
                  <AccountRow
                    substrateAccountPrefix={substrateAccountPrefix}
                    address={account.address}
                    name={account.name}
                    balance={
                      showBalances
                        ? showBalances.output?.(
                            account.address,
                            filteredBalances.find(b => b.address === account.address)
                          ) ?? null
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
      )}
    </Select>
  )
}
