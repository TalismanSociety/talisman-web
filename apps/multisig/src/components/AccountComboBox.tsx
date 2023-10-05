import { InjectedAccount } from '@domains/extension'
import { Identicon } from '@talismn/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import truncateMiddle from 'truncate-middle'
import { ChevronVertical, Search } from '@talismn/icons'
import { useOnClickOutside } from '../domains/common/useOnClickOutside'

type Props = {
  accounts: InjectedAccount[]
  selectedAccount: InjectedAccount
  signingInTo?: InjectedAccount
  onSelect?: (account: InjectedAccount) => void
}

const AccountRow = ({ account }: { account: InjectedAccount }) => {
  const addressString = account.address.toSs58()
  return (
    <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Identicon size={24} value={addressString} />
      <p css={({ color }) => ({ marginTop: 4, color: color.lightGrey })}>
        {account.meta.name}{' '}
        <span css={({ color }) => ({ color: color.offWhite })}>({truncateMiddle(addressString, 4, 5, '...')})</span>
      </p>
    </div>
  )
}

const AccountComboBox: React.FC<Props> = ({ accounts, onSelect, selectedAccount }) => {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef(null)
  const [query, setQuery] = useState('')
  useOnClickOutside(ref.current, () => setExpanded(false))

  const filteredAccounts = useMemo(() => {
    if (!query) return accounts
    return accounts.filter(
      acc =>
        acc.meta.name?.toLowerCase().includes(query.toLowerCase()) ||
        acc.address.toSs58().toLowerCase().includes(query.toLowerCase())
    )
  }, [query, accounts])

  useEffect(() => {
    if (!expanded && query.length > 0) setQuery('')
  }, [expanded, query.length])

  return (
    <div ref={ref} css={{ position: 'relative', width: '100%' }}>
      <div
        css={({ color }) => ({
          display: 'flex',
          justifyContent: 'space-between',
          background: color.foreground,
          borderRadius: 8,
          width: '100%',
          padding: '16px 24px',
          ...(accounts.length > 1
            ? {
                'cursor': 'pointer',
                ':hover': {
                  div: { color: color.offWhite },
                },
              }
            : {}),
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <AccountRow account={selectedAccount} />
        <div
          css={({ color }) => ({
            lineHeight: 1,
            visibility: accounts.length > 1 ? 'visible' : 'hidden',
            color: expanded ? color.offWhite : color.lightGrey,
          })}
        >
          <ChevronVertical size={24} />
        </div>
      </div>
      {accounts.length > 1 && (
        <div
          css={({ color }) => ({
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: 16,
            backgroundColor: color.foreground,
            borderRadius: 8,
            padding: '0 24px',
            width: '100%',
            zIndex: 1,
            height: 'min-content',
            maxHeight: expanded ? 220 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.2s ease-in-out',
          })}
        >
          <div
            css={({ foreground }) => ({
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              borderBottom: `rgba(${foreground}, 0.1) solid 1px`,
              paddingTop: 8,
            })}
          >
            <Search />
            <input
              css={{ border: 'none', backgroundColor: 'transparent', width: '100%', padding: '16px 0px' }}
              placeholder="Search Account..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div css={{ maxHeight: 160, overflowY: 'auto', padding: '8px 0' }}>
            {filteredAccounts.map(acc => (
              <div
                css={({ color }) => ({
                  'borderRadius': 8,
                  'padding': '8px 0',
                  'cursor': 'pointer',
                  ':hover': { div: { p: { color: color.offWhite } } },
                  'width': '100%',
                })}
                key={acc.address.toSs58()}
                onClick={() => {
                  setExpanded(false)
                  onSelect?.(acc)
                }}
              >
                <AccountRow account={acc} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountComboBox
