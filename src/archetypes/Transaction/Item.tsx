import { Info, PanelSection } from '@components'
import { ReactComponent as ExternalLink } from '@icons/external-link.svg'
import { useAccounts } from '@libs/talisman'
import Identicon from '@polkadot/react-identicon'
import { encodeAnyAddress } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import startCase from 'lodash/startCase'
import { useMemo } from 'react'
import styled from 'styled-components'

import ItemDetails from './ItemDetails'
import Logo from './Logo'
import { Transaction } from './types'

type Props = { className?: string; transaction: Transaction; addresses: string[] }
const TransactionItem = styled(({ className, transaction, addresses }: Props) => {
  const accounts = useAccounts()

  const { name, ss58Format, timestamp, blockExplorerUrl, parsed, relatedAddresses } = transaction
  const youAddress = relatedAddresses.find(address => addresses.includes(address))
  const youAccount = useMemo(
    () => accounts.find(({ address }) => address === youAddress)?.name || youAddress,
    [accounts, youAddress]
  )

  return (
    <>
      <PanelSection
        className={`transaction-item ${className}`}
        initial={{ opacity: 0, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
        animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
        exit={{ opacity: 0, scale: 0.5, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
      >
        <Info
          title={parsed?.type ? startCase(parsed.type) : name}
          subtitle={timestamp.fromNow()}
          graphic={<Logo className="category-logo" parsed={parsed} addresses={addresses} />}
        />

        <Info
          title={youAccount}
          subtitle={truncateAddress(youAddress ? encodeAnyAddress(youAddress, ss58Format) : youAddress, 4)}
          graphic={<Identicon value={youAddress} theme="polkadot" />}
        />

        <ItemDetails parsed={transaction.parsed} addresses={addresses} />

        <div className="external-link">
          {blockExplorerUrl ? (
            <a className="link" href={blockExplorerUrl} target="_blank" rel="noreferrer">
              <ExternalLink />
            </a>
          ) : (
            <span className="link">
              <svg />
            </span>
          )}
        </div>
      </PanelSection>
      {!parsed ? (
        <pre className={`${className} debug`}>{JSON.stringify(JSON.parse(transaction._data), null, 2)}</pre>
      ) : null}
    </>
  )
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  &.debug {
    overflow: hidden;
    font-size: var(--font-size-xsmall);
    line-height: 1;
  }

  > .info {
    justify-content: flex-start;
  }

  > *:nth-child(1) {
    width: 25%;
  }
  > *:nth-child(2) {
    width: 20%;
  }
  > *:nth-child(3) {
    width: 40%;
  }
  > *:nth-child(4) {
    width: 10%;
  }

  > .details {
    display: flex;
    align-items: center;

    > *:first-child {
      width: 47.5%;
      justify-content: flex-end;
    }
    > *:nth-child(2) {
      width: 5%;
      justify-content: center;
    }
    > *:last-child {
      width: 47.5%;
      justify-content: flex-end;
    }

    .title,
    .subtitle {
      width: 12rem;
      overflow: hidden;
    }
  }

  .category-logo,
  .graphic .chain-logo,
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
`

export default TransactionItem
