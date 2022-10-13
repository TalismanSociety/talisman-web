import { Account } from '@archetypes'
import { MaterialLoader, Panel, PanelSection } from '@components'
import styled from '@emotion/styled'
import { Account as TAccount } from '@libs/talisman'
import { AnimatePresence } from 'framer-motion'
import groupBy from 'lodash/groupBy'
import moment from 'moment-timezone'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import { Item } from './Item'
import { useTransactions } from './store'
import { useUrlParams } from './util'

type Props = {
  addresses: string[]
  className?: string
}
export const List = styled(({ addresses = [], className }: Props) => {
  const { t } = useTranslation()

  const urlAddress = useUrlParams(['address'])[0]

  const [selectedAccount, setSelectedAccount] = useState<TAccount | undefined>(undefined)
  const [fetchAddresses, setFetchAddresses] = useState(addresses)
  useEffect(() => {
    if (!selectedAccount) return setFetchAddresses(urlAddress ? [urlAddress, ...addresses] : addresses)
    setFetchAddresses([selectedAccount.address])
  }, [addresses, selectedAccount, urlAddress])

  const { loadMore, hasMore, transactions, status } = useTransactions(fetchAddresses)
  const hasTransactions = Object.keys(transactions).length > 0

  const [loadMoreRef] = useInfiniteScroll({
    loading: status === 'PROCESSING',
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: status === 'ERROR',
    rootMargin: '0px 0px 200px 0px',
  })

  const sortedTransactions = useMemo(
    () => Object.values(transactions).sort((a, b) => b.id.localeCompare(a.id)),
    [transactions]
  )
  const dayGroupedTransactions = useMemo(
    () => groupBy(sortedTransactions, tx => tx.timestamp.clone().startOf('day').toISOString()),
    [sortedTransactions]
  )

  return (
    <section className={`transaction-list ${className}`}>
      <header>
        <Account.Picker
          showAllAccounts
          additionalAccounts={urlAddress ? [{ name: urlAddress, address: urlAddress }] : []}
          onChange={setSelectedAccount}
        />
      </header>

      <Panel className="transaction-item-container">
        <AnimatePresence>
          {status === 'INITIALISED' || (status === 'PROCESSING' && !hasTransactions) ? (
            <PanelSection
              key="first"
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <MaterialLoader /> <div>{t('Searching the paraverse')}</div>
            </PanelSection>
          ) : status === 'ERROR' ? (
            <PanelSection
              key="first"
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <div>{t('An error occured')}</div>
            </PanelSection>
          ) : !hasTransactions ? (
            <PanelSection
              key="first"
              className="centered-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              {t('No Transactions - try another account')}
            </PanelSection>
          ) : (
            Object.entries(dayGroupedTransactions).map(([day, transactions], index) => (
              <Fragment key={index === 0 ? 'first' : day}>
                <h3 className="transaction-date">{moment(day).format('ddd D MMMM YYYY')}</h3>
                {transactions.map(transaction => (
                  <Item key={transaction.id} transaction={transaction} addresses={fetchAddresses} />
                ))}
              </Fragment>
            ))
          )}
        </AnimatePresence>
      </Panel>

      <footer>
        {(status === 'PROCESSING' || hasMore) && hasTransactions && (
          <div className="load-more" ref={loadMoreRef}>
            <MaterialLoader /> <div>{t('Searching the paraverse')}</div>
          </div>
        )}
        {status === 'SUCCESS' && !hasMore && hasTransactions && (
          <div className="load-more complete" ref={loadMoreRef}>
            {t('Search complete')}
          </div>
        )}
      </footer>
    </section>
  )
})`
  > header {
    padding-bottom: 1rem;
    margin-bottom: 1em;

    .account-picker {
      width: 500px;
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

  .load-more {
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
