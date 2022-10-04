import { Account } from '@archetypes'
import { MaterialLoader, Panel, PanelSection } from '@components'
import styled from '@emotion/styled'
import { Account as TAccount } from '@libs/talisman'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import Item from './Item'
import { useTransactions } from './store'
import { useUrlParams } from './util'

type ITransactionListProps = {
  addresses: string[]
  className?: string
}

const TransactionList = ({ addresses = [], className }: ITransactionListProps) => {
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
        <AnimatePresence exitBeforeEnter>
          {status === 'INITIALISED' || (status === 'PROCESSING' && !hasTransactions) ? (
            <PanelSection
              className="centered-state"
              initial={{ opacity: 0, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              exit={{ opacity: 0, scale: 0.5, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <MaterialLoader /> <div>{t('Searching the paraverse')}</div>
            </PanelSection>
          ) : status === 'ERROR' ? (
            <PanelSection
              className="centered-state"
              initial={{ opacity: 0, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              exit={{ opacity: 0, scale: 0.5, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <div>{t('An error occured')}</div>
            </PanelSection>
          ) : !hasTransactions ? (
            <PanelSection
              className="centered-state"
              initial={{ opacity: 0, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
              exit={{ opacity: 0, scale: 0.5, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              {t('No Transactions - try another account')}
            </PanelSection>
          ) : (
            <>
              {Object.values(transactions)
                .sort((a, b) => b.id.localeCompare(a.id))
                .map(transaction => (
                  <Item key={transaction.id} transaction={transaction} addresses={fetchAddresses} />
                ))}
            </>
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
}

const StyledTransactionList = styled(TransactionList)`
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

export default StyledTransactionList
