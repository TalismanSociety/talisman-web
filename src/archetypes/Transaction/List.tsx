import { Field, MaterialLoader, Panel, PanelSection } from '@components'
import styled from '@emotion/styled'
import { useActiveAccount } from '@libs/talisman'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { motion } from 'framer-motion'
import groupBy from 'lodash/groupBy'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroller'
import { useDebounce } from 'react-use'

import { Item } from './Item'
import { useTransactions, useUrlParams } from './lib'

type Props = {
  addresses: string[]
  className?: string
}
export const List = styled(({ addresses = [], className }: Props) => {
  const { t } = useTranslation()

  const urlAddress = useUrlParams(['address'])[0]

  const { hasActiveAccount, address: selectedAddress } = useActiveAccount()
  const [fetchAddresses, setFetchAddresses] = useState(addresses)
  useEffect(() => {
    if (!hasActiveAccount) return setFetchAddresses(urlAddress ? [urlAddress, ...addresses] : addresses)
    setFetchAddresses([selectedAddress])
  }, [addresses, hasActiveAccount, selectedAddress, urlAddress])

  const [searchQuery, setSearchQuery] = useState('')
  const [searchQueryDebounced, setSearchQueryDebounced] = useState('')
  useDebounce(() => setSearchQueryDebounced(searchQuery), 250, [searchQuery])

  const { loadMore, hasMore, transactions, status } = useTransactions(fetchAddresses, searchQueryDebounced)
  const hasTransactions = Object.keys(transactions).length > 0

  const sortedTransactions = useMemo(
    () => Object.values(transactions).sort((a, b) => b.id.localeCompare(a.id)),
    [transactions]
  )
  const dayGroupedTransactions = useMemo(
    () => groupBy(sortedTransactions, tx => startOfDay(parseISO(tx.timestamp)).toISOString()),
    [sortedTransactions]
  )

  return (
    <section className={`transaction-list ${className}`}>
      <header>
        <Field.Search value={searchQuery} onChange={setSearchQuery} placeholder="Filter by Chain, Address, Type..." />
      </header>

      <Panel className="transaction-item-container">
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore && status !== 'ERROR'}
          loader={
            <PanelSection
              key="loader"
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <MaterialLoader /> <div>{t('Searching the paraverse')}</div>
            </PanelSection>
          }
        >
          {Object.entries(dayGroupedTransactions).map(([day, transactions], index) => (
            <Fragment key={`${day}-${selectedAddress}`}>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
                className="transaction-date"
              >
                {format(parseISO(day), 'eee d MMMM yyyy')}
              </motion.h3>
              {transactions.map(transaction => (
                <Item
                  key={`${transaction.id}-${selectedAddress}`}
                  transaction={transaction}
                  addresses={fetchAddresses}
                  selectedAccount={selectedAddress}
                />
              ))}
            </Fragment>
          ))}

          {status === 'SUCCESS' && !hasTransactions && (
            <PanelSection
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              {t('No Transactions - try another account')}
            </PanelSection>
          )}

          {status === 'ERROR' && (
            <PanelSection
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <div>{t('An error occured')}</div>
            </PanelSection>
          )}
        </InfiniteScroll>
      </Panel>

      <footer>
        {status === 'SUCCESS' && !hasMore && hasTransactions && (
          <div className="seach-complete">{t('Search complete')}</div>
        )}
      </footer>
    </section>
  )
})`
  > header {
    padding-bottom: 1rem;
    margin-bottom: 1em;

    .field-search {
      max-width: 500px;
    }
  }

  > .transaction-item-container > .inner {
    ::before,
    ::after {
      content: '';
      display: table;
    }
  }

  .transaction-item {
    transition: all 0.2s;
    &:hover {
      background: var(--color-activeBackground);
    }
  }

  > footer {
    padding-top: 1rem;
    margin-top: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrow-down {
    transform: rotate(90deg);
  }

  .transaction-date {
    margin: 1.4rem;
    color: white;
  }
  .transaction-date:not(:first-child) {
    margin-top: 3rem;
  }

  .centered-state {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    > * {
      margin: 0 0.3em;
    }
  }

  .seach-complete {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-mid);

    > * {
      margin: 0 0.3em;
    }
  }
`
