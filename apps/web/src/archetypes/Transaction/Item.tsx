import { Info, PanelSection } from '@components'
import Identicon from '@components/atoms/Identicon'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import { useAccounts } from '@libs/talisman'
import { encodeAnyAddress } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import intlFormat from 'date-fns/intlFormat'
import parseISO from 'date-fns/parseISO'
import startCase from 'lodash/startCase'
import { useMemo } from 'react'

import { ClickToCopy } from './ClickToCopy'
import { ItemDetails } from './ItemDetails'
import { Transaction } from './lib'
import { TransactionLogo } from './TransactionLogo'

type Props = { className?: string; transaction: Transaction; addresses: string[]; selectedAccount?: string }
export const Item = styled(({ className, transaction, addresses, selectedAccount }: Props) => {
  const accounts = useAccounts()

  const { name, ss58Format, timestamp, explorerUrl, parsed, relatedAddresses } = transaction
  const youAddress = relatedAddresses.find(address => addresses.includes(address))
  const youAccount = useMemo(
    () => accounts.find(({ address }) => address === youAddress)?.name ?? youAddress,
    [accounts, youAddress]
  )

  const getTransactionName = () => {
    // if tx type is not parsed, use the event name as a fallback (e.g. Staking.Bonded, Dex.Swap)
    if (typeof parsed?.__typename !== 'string') return name ?? undefined

    switch (parsed.__typename) {
      // Special case: show 'Send' / 'Receive' / 'Transfer' for transfers, depending on whether
      // the user's connected accounts include the sender, the receiver, or both
      case 'ParsedTransfer': {
        const genericAddresses = addresses.map(a => encodeAnyAddress(a))
        const from = encodeAnyAddress(parsed.from)
        const to = encodeAnyAddress(parsed.to)

        if (genericAddresses.includes(from) && !genericAddresses.includes(to)) return 'Send'
        if (genericAddresses.includes(to) && !genericAddresses.includes(from)) return 'Receive'
        return 'Transfer'
      }

      // Special case: show `Contribute` instead of `CrowdloanContribute`
      case 'ParsedCrowdloanContribute':
        return 'Contribute'

      // For all other cases, just strip off the Parsed prefix and startCase the rest
      // i.e. ParsedSwap -> Swap
      default:
        return startCase(parsed.__typename.replace(/^Parsed/, ''))
    }
  }

  const isDevMode = process.env.NODE_ENV === 'development'
  const isParsed = typeof parsed?.__typename === 'string'
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
        {typeof selectedAccount !== 'string' && (
          <Info
            title={
              <ClickToCopy
                copy={youAddress ? encodeAnyAddress(youAddress, ss58Format) : undefined}
                message="Address copied to the clipboard"
              >
                {youAccount}
              </ClickToCopy>
            }
            subtitle={
              <ClickToCopy
                copy={youAddress ? encodeAnyAddress(youAddress, ss58Format) : undefined}
                message="Address copied to the clipboard"
              >
                {truncateAddress(youAddress ? encodeAnyAddress(youAddress, ss58Format) : youAddress, 4)}
              </ClickToCopy>
            }
            // Probably not the best, but at the moment I'm not 100% sure where this would be utilised.
            graphic={<Identicon value={youAddress ?? ''} size="3.2rem" />}
          />
        )}

        <Info
          css={css`
            .title {
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          `}
          title={getTransactionName()}
          subtitle={intlFormat(parseISO(timestamp), { hour: 'numeric', minute: 'numeric' })}
          graphic={<TransactionLogo className="category-logo" parsed={parsed} addresses={addresses} />}
        />

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
          {JSON.stringify({ ...transaction, args: JSON.parse(transaction.args ?? '{}') }, null, 2)}
        </pre>
      )}
    </>
  )
})`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 2.5fr 2.5fr 5fr 1fr;
  align-items: center;
  text-align: left;

  transition: all 0.2s;
  &:hover {
    background: var(--color-activeBackground);
  }

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
