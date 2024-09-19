import AccountIcon from './molecules/AccountIcon'
import { walletConnectionSideSheetOpenState } from './widgets/WalletConnectionSideSheet'
import { evmAccountsState, substrateAccountsState } from '@/domains/accounts'
import { AccountWithBtc, isBtcAddress } from '@/lib/btc'
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
    switch (accountsType) {
      case 'ethereum':
        return evmAccounts.find(account => account.address === value)
      case 'substrate':
        return substrateAccounts.find(account => account.address === value)
      case 'all':
        return [...evmAccounts, ...substrateAccounts].find(account => account.address === value)
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
              <p className="text-gray-400 text-[12px]">Ethereum Accounts</p>
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
      <Surface className="[&>p]:text-[14px] p-[12px] rounded-[8px]">
        <p className="text-center">BTC accounts not supported.</p>
      </Surface>
    )

  if (accountsType === 'ethereum' && !allowInput) {
    const evmAccount = evmAccounts[0]
    return (
      <Surface className="[&>p]:text-[14px] p-[12px] rounded-[8px]">
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
      className="w-full [&>button]:!py-[12px] [&>button]:!rounded-[8px] [&>button>div]:w-full"
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
