import { InjectedAccount } from '@domains/extension'
import { CircularProgressIndicator, Identicon } from '@talismn/ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronVertical, Search } from '@talismn/icons'
import { useOnClickOutside } from '../domains/common/useOnClickOutside'
import { useSignIn } from '../domains/auth'
import { useSelectedMultisig } from '../domains/multisig'
import { Address } from '../util/addresses'
import { Chain } from '../domains/chains'
import { AccountDetails } from './AddressInput/AccountDetails'

type Props = {
  accounts: InjectedAccount[]
  selectedAccount?: InjectedAccount
  onSelect?: (account: InjectedAccount) => void
}

const AccountRow = ({
  account,
  onSelect,
  chain,
}: {
  account: InjectedAccount
  onSelect: (account: InjectedAccount) => void
  chain?: Chain
}) => (
  <div
    onClick={() => onSelect?.(account)}
    css={({ color }) => ({
      'display': 'flex',
      'alignItems': 'center',
      'gap': 8,
      'padding': '8px 12px',
      'cursor': 'pointer',
      'width': '100%',
      'backgroundColor': color.surface,
      ':hover': {
        filter: 'brightness(1.2)',
        div: { p: { color: color.offWhite } },
      },
    })}
  >
    <AccountDetails identiconSize={32} address={account.address} name={account.meta.name} breakLine disableCopy />
  </div>
)

const AccountSwitcher: React.FC<Props> = ({ accounts, onSelect, selectedAccount }) => {
  const [expanded, setExpanded] = useState(false)
  const { signIn } = useSignIn()
  const [multisig] = useSelectedMultisig()
  const ref = useRef(null)
  const [query, setQuery] = useState('')
  const [accountToSignIn, setAccountToSignIn] = useState<InjectedAccount>()
  useOnClickOutside(ref.current, () => setExpanded(false))

  // cannot close if signing in
  const actualExpanded = expanded || accountToSignIn

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      const isSelectedAccount = selectedAccount?.address.isEqual(acc.address)

      let queryAddress: Address | false = false
      try {
        queryAddress = Address.fromSs58(query)
      } catch (e) {}

      // query by pasting address
      if (queryAddress) return !isSelectedAccount && queryAddress.isEqual(acc.address)

      const isQueryMatch =
        !query || `${acc.meta.name} ${acc.address.toSs58()}`.toLowerCase().includes(query.toLowerCase())
      return !isSelectedAccount && isQueryMatch
    })
  }, [query, accounts, selectedAccount])

  useEffect(() => {
    if (!actualExpanded && query.length > 0) setQuery('')
  }, [actualExpanded, query.length])

  const handleSelectAccount = async (account: InjectedAccount) => {
    setQuery('')
    setAccountToSignIn(account)
    try {
      await signIn(account)
    } catch (e) {
    } finally {
      setAccountToSignIn(undefined)
      setExpanded(false)
    }
  }

  if (!selectedAccount) return null

  return (
    <div ref={ref} css={{ position: 'relative', width: '100%' }}>
      <div
        css={({ color }) => ({
          'alignItems': 'center',
          'display': 'flex',
          'justifyContent': 'space-between',
          'background': color.surface,
          'borderRadius': 8,
          'border': `solid 1px ${actualExpanded ? color.border : 'rgba(0,0,0,0)'}`,
          'borderBottom': 'none',
          'width': '100%',
          'padding': '8px 12px',
          'cursor': 'pointer',
          ':hover': {
            div: { color: color.offWhite },
          },
        })}
        onClick={() => setExpanded(!expanded)}
      >
        <div css={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8, width: 154 }}>
          <AccountDetails
            identiconSize={32}
            address={selectedAccount.address}
            name={selectedAccount.meta.name}
            chain={multisig.chain}
            breakLine
            disableCopy
          />
        </div>
        <div
          css={({ color }) => ({
            height: 'max-content',
            lineHeight: 1,
            color: actualExpanded ? color.offWhite : color.lightGrey,
          })}
        >
          <ChevronVertical size={24} />
        </div>
      </div>
      <div
        css={({ color }) => ({
          position: 'absolute',
          top: '100%',
          // to cover the transition of bottom border radius
          marginTop: -8,
          paddingTop: 8,
          left: 0,
          backgroundColor: color.surface,
          borderRadius: '0px 0px 4px 4px',
          border: `solid 1px ${actualExpanded ? color.border : 'rgba(0,0,0,0)'}`,
          visibility: actualExpanded ? 'visible' : 'hidden',
          borderTop: 'none',
          width: '100%',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          // height is fixed when actualExpanded to leave enough space for loading indicator
          height: actualExpanded ? 210 : 0,
          overflow: 'hidden',
          transition: '0.2s ease-in-out',
        })}
      >
        {accountToSignIn ? (
          <div
            css={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center',
            }}
          >
            <div css={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
              <CircularProgressIndicator />
              <p css={({ color }) => ({ color: color.offWhite })}>Signing In</p>
            </div>
            <Identicon size={40} value={accountToSignIn.address.toSs58(multisig.chain)} />
            <p css={({ color }) => ({ color: color.offWhite, marginTop: 8 })}>{accountToSignIn.meta.name}</p>
            <p css={{ fontSize: 12, marginTop: 4 }}>{accountToSignIn.address.toShortSs58(multisig.chain)}</p>
          </div>
        ) : (
          <>
            <div
              css={({ foreground }) => ({
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                borderBottom: `rgba(${foreground}, 0.1) solid 1px`,
                padding: '0 12px',
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
            <div css={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map(acc => (
                  <AccountRow
                    key={acc.address.toSs58()}
                    account={acc}
                    onSelect={handleSelectAccount}
                    chain={multisig.chain}
                  />
                ))
              ) : (
                <div css={{ height: '100%', display: 'flex', alignItems: 'center', width: '100%', padding: 16 }}>
                  <p css={{ textAlign: 'center', fontSize: 14, width: '100%' }}>No accounts available to switch to.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AccountSwitcher
