import { Info, PanelSection } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import { useAccounts } from '@libs/talisman'
import { encodeAnyAddress } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import parseISO from 'date-fns/parseISO'
import startCase from 'lodash/startCase'
import { useMemo } from 'react'

import { Avatar } from './Avatar'
import { ItemDetails } from './ItemDetails'
import { Transaction } from './lib'
import { Logo } from './Logo'

type Props = { className?: string; transaction: Transaction; addresses: string[]; selectedAccount?: string }
export const Item = styled(({ className, transaction, addresses, selectedAccount }: Props) => {
  const accounts = useAccounts()

  const { name, ss58Format, timestamp, explorerUrl, parsed, relatedAddresses } = transaction
  const youAddress = relatedAddresses.find(address => addresses.includes(address))
  const youAccount = useMemo(
    () => accounts.find(({ address }) => address === youAddress)?.name || youAddress,
    [accounts, youAddress]
  )

  const getTransactionName = () => {
    if (typeof parsed?.__typename !== 'string') return name || undefined
    if (parsed.__typename !== 'ParsedTransfer') return startCase(parsed.__typename.replace(/^Parsed/, ''))

    const genericAddresses = addresses.map(a => encodeAnyAddress(a))
    const from = encodeAnyAddress(parsed.from)
    const to = encodeAnyAddress(parsed.to)

    if (genericAddresses.includes(from) && !genericAddresses.includes(to)) return 'Send'
    if (genericAddresses.includes(to) && !genericAddresses.includes(from)) return 'Receive'
    return 'Transfer'
  }

  const isDevMode = process.env.NODE_ENV === 'development'
  const isParsed = !!parsed
  const isTransfer = isParsed && parsed.__typename === 'ParsedTransfer'
  const hasTokenSymbol = isTransfer && parsed.tokenSymbol !== '???'

  const showDebugInfo = (isDevMode && !isParsed) || (isDevMode && isTransfer && !hasTokenSymbol)

  return (
    <>
      <PanelSection
        className={`transaction-item ${typeof selectedAccount === 'string' ? 'selected-account' : ''} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
      >
        <Info
          title={getTransactionName()}
          subtitle={formatDistanceToNowStrict(parseISO(timestamp), { addSuffix: true })}
          graphic={<Logo className="category-logo" parsed={parsed} addresses={addresses} />}
        />

        {typeof selectedAccount !== 'string' && (
          <Info
            title={youAccount}
            subtitle={truncateAddress(youAddress ? encodeAnyAddress(youAddress, ss58Format) : youAddress, 4)}
            graphic={<Avatar value={youAddress} />}
          />
        )}

        <ItemDetails parsed={transaction.parsed} accounts={accounts} addresses={addresses} />

        <div className="external-link">
          {explorerUrl ? (
            <a className="link" href={explorerUrl} target="_blank" rel="noreferrer">
              <ExternalLink />
            </a>
          ) : (
            <span className="link">
              <svg />
            </span>
          )}
        </div>
      </PanelSection>
      {showDebugInfo && (
        <pre className={`${className} debug`}>
          {JSON.stringify({ ...transaction, args: JSON.parse(transaction.args || '{}') }, null, 2)}
        </pre>
      )}
    </>
  )
})`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 2.5fr 2.5fr 4fr 1fr;
  align-items: center;
  text-align: left;

  &.selected-account {
    grid-template-columns: 2.5fr 6.5fr 1fr;

    > *:nth-child(2) {
      justify-self: center;
    }
  }

  > .info {
    justify-content: flex-start;
  }

  > .details {
    display: flex;
    align-items: center;

    > *:last-child {
      padding-left: 2rem;
    }

    .title,
    .subtitle {
      width: 14rem;
      overflow: hidden;
    }
  }

  .category-logo,
  .graphic .token-logo,
  .graphic .ui--IdentityIcon {
    font-size: 3.2rem;
    width: 1em;
    height: 1em;
    cursor: default;
  }

  .info {
    font-size: var(--font-size-normal);

    .title,
    .subtitle {
      font-weight: var(--font-weight-regular);
    }

    .subtitle {
      font-size: var(--font-size-xsmall);
    }
  }

  .external-link {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    > .link {
      display: block;
      padding: 1em;
      margin: -1em;

      > svg {
        display: block;
        width: 1.2em;
        height: 1.2em;
      }
    }
  }

  &.debug {
    overflow: hidden;
    font-size: var(--font-size-xsmall);
    line-height: 1;
  }
`
