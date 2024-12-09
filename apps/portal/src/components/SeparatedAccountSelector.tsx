import type React from 'react'
import { decodeAddress, encodeAddress, isAddress as isSubstrateAddress } from '@polkadot/util-crypto'
import { type Balances, type BalanceSearchQuery } from '@talismn/balances'
import { useBalances } from '@talismn/balances-react'
import { Surface } from '@talismn/ui/atoms/Surface'
import { Select } from '@talismn/ui/molecules/Select'
import { encodeAnyAddress } from '@talismn/util'
import { Ethereum } from '@talismn/web-icons'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { isAddress } from 'viem'

import AccountIcon from '@/components/molecules/AccountIcon'
import { walletConnectionSideSheetOpenState } from '@/components/widgets/WalletConnectionSideSheet'
import { evmAccountsState, substrateAccountsState } from '@/domains/accounts'
import { AccountWithBtc, isBtcAddress } from '@/lib/btc'
import { cn } from '@/lib/utils'
import { shortenAddress } from '@/util/shortenAddress'

type Props = {
  allowInput?: boolean
  accountsType?: 'substrate' | 'ethereum' | 'all' | 'btc'
  /** Selected Account Address */
  onAccountChange?: (address: string | null) => void
  evmAccountsFilter?: (account: AccountWithBtc) => boolean
  showBalances?: {
    filter?: BalanceSearchQuery | BalanceSearchQuery[]
    output?: (address: string, addressBalances: Balances) => React.ReactNode
  }
  substrateAccountsFilter?: (account: AccountWithBtc) => boolean
  substrateAccountPrefix?: number
  disableBtc?: boolean
  value?: string | null
}

const AccountRow: React.FC<{
  name?: string
  address: string
  balance?: React.ReactNode
  substrateAccountPrefix?: number
}> = ({ address, name, balance, substrateAccountPrefix }) => {
  const formattedAddress = useMemo(() => {
    if (address.startsWith('0x') || substrateAccountPrefix === undefined || isBtcAddress(address)) return address
    return encodeAddress(decodeAddress(address), substrateAccountPrefix)
  }, [address, substrateAccountPrefix])

  return (
    <div className="flex w-full items-center justify-between">
      <div className="grid gap-[1px]">
        <p
          className={cn('overflow-hidden text-ellipsis whitespace-nowrap font-semibold !leading-none', {
            'text-[14px]': formattedAddress.startsWith('0x'),
          })}
        >
          {name ?? shortenAddress(formattedAddress, 6)}
        </p>
        {name ? (
          <p className="mt-[2px] !text-[12px] !leading-none !text-gray-300 brightness-100">
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
  disableBtc = false,
}) => {
  const defaultEvmAccounts = useRecoilValue(evmAccountsState)
  const defaultSubstrateAccounts = useRecoilValue(substrateAccountsState)
  const setWalletConnectionSideSheetOpen = useSetRecoilState(walletConnectionSideSheetOpenState)
  const [query, setQuery] = useState('')

  const balances = useBalances()
  const filteredBalances = useMemo(() => {
    if (showBalances && showBalances.filter) return balances.find(showBalances.filter)
    return balances
  }, [showBalances, balances])

  const accountFromInput = useMemo((): AccountWithBtc | null => {
    if (!allowInput) return null

    const btcAddress = isBtcAddress(query)
    if (btcAddress) return btcAddress

    try {
      if (isAddress(query))
        return {
          address: query,
          type: 'ethereum',
          partOfPortfolio: false,
          readonly: true,
        }
    } catch (e) {
      // do nothing
    }

    try {
      if (isSubstrateAddress(query))
        return {
          // computation will always be done in generic format
          address: encodeAddress(decodeAddress(query), 42),
          type: 'sr25519',
          partOfPortfolio: false,
          readonly: true,
        }
    } catch (e) {
      // do nothing
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
    return [accountFromInput, ...filtered].filter(
      a => a.type === 'sr25519' || a.type === 'ed25519' || a.type === 'ecdsa'
    )
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

  const btcAccounts = useMemo(() => {
    if (accountFromInput?.type === 'btc-base58' || accountFromInput?.type === 'btc-bench32') return [accountFromInput]
    return []
  }, [accountFromInput])

  const selectedAccount = useMemo(() => {
    if (value === null || value === undefined) return

    switch (accountsType) {
      case 'ethereum':
        return evmAccounts.find(account => account.address === value)
      case 'substrate': {
        const encodedValue = encodeAnyAddress(value)
        return substrateAccounts.find(account => encodeAnyAddress(account.address) === encodedValue)
      }
      case 'all': {
        const encodedValue = encodeAnyAddress(value)
        return [...evmAccounts, ...substrateAccounts].find(
          account => encodeAnyAddress(account.address) === encodedValue
        )
      }
      case 'btc':
        return btcAccounts.find(account => account.address === value)
    }
  }, [accountsType, evmAccounts, substrateAccounts, btcAccounts, value])

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

  const renderNetworkAccounts = useCallback(
    ({
      type,
      accounts,
      emptyQueryMessage,
      emptyState,
      queriedAccounts,
    }: {
      type: Required<Props>['accountsType']
      accounts: AccountWithBtc[]
      emptyQueryMessage?: string
      emptyState?: React.ReactNode
      queriedAccounts: AccountWithBtc[]
    }) => {
      if (accountsType !== 'all' && type !== accountsType) return null

      return (
        <div>
          {accountsType === 'all' && (
            <div className="px-[12px]">
              <p className="text-[12px] text-gray-400">Ethereum Accounts</p>
            </div>
          )}
          {accounts.length > 0 ? (
            queriedAccounts.length > 0 ? (
              queriedAccounts.map(account => (
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
                  className="!w-full [&>div]:w-full "
                />
              ))
            ) : (
              <div className="px-[12px] pb-[16px]">
                <p className="text-[14px]">{emptyQueryMessage ?? 'No account found.'}</p>
              </div>
            )
          ) : (
            emptyState ?? (
              <div className="px-[12px] pb-[16px]">
                <p className="text-[14px]">{emptyQueryMessage ?? 'No account found.'}</p>
              </div>
            )
          )}
        </div>
      )
    },
    [accountsType, filteredBalances, showBalances, substrateAccountPrefix]
  )
  if (accountsType === 'btc' && disableBtc)
    return (
      <Surface className="rounded-[8px] p-[12px] [&>p]:text-[14px]">
        <p className="text-center">BTC accounts not supported.</p>
      </Surface>
    )

  if (accountsType === 'ethereum' && !allowInput) {
    const evmAccount = evmAccounts[0]
    return (
      <Surface className="rounded-[8px] p-[12px] [&>p]:text-[14px]">
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
      className="w-full [&>button>div]:w-full [&>button]:!rounded-[8px] [&>button]:!py-[12px]"
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
      {renderNetworkAccounts({
        accounts: evmAccounts,
        queriedAccounts: queriedEvmAccounts,
        type: 'ethereum',
        emptyState: (
          <div
            className="group mt-[4px] flex !w-full cursor-pointer items-center gap-[4px] !rounded-none p-[12px] py-[8px] hover:bg-gray-700"
            onClick={() => {
              setWalletConnectionSideSheetOpen(true)
            }}
          >
            <div className="flex h-[32px] w-[32px] items-center justify-center">
              <Ethereum className="text-gray-400 group-hover:text-white " size={16} />
            </div>
            <p className="text-[14px] text-gray-400 group-hover:text-white">Connect Ethereum Wallet</p>
          </div>
        ),
        emptyQueryMessage: 'No Ethereum account found.',
      })}
      {renderNetworkAccounts({
        type: 'substrate',
        accounts: substrateAccounts,
        queriedAccounts: queriedSubstrateAccounts,
        emptyQueryMessage: 'No Polkadot account found.',
      })}
      {renderNetworkAccounts({
        type: 'btc',
        accounts: btcAccounts,
        queriedAccounts: btcAccounts,
        emptyQueryMessage: 'Please provide a valid Bitcoin address.',
      })}
    </Select>
  )
}
