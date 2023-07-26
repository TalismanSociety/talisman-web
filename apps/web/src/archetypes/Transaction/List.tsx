import { Button, Field, MaterialLoader, Panel, PanelSection } from '@components'
import { legacySelectedAccountState } from '@domains/accounts/recoils'
import ExportTxHistoryWidget from '@domains/txHistory/widgets/ExportTxHistoryWidget'
import { css } from '@emotion/react'
import { AlertCircle } from '@talismn/icons'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import startOfDay from 'date-fns/startOfDay'
import { motion } from 'framer-motion'
import groupBy from 'lodash/groupBy'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroller'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { useRecoilValue } from 'recoil'

import { Item } from './Item'
import { useTransactions } from './lib'

type Props = {
  addresses: string[]
  className?: string
}
export const List = ({ addresses = [], className }: Props) => {
  const { t } = useTranslation()

  const [searchParams, setSearchParams] = useSearchParams()
  const urlAddresses = useMemo(() => searchParams.getAll('address'), [searchParams])
  const selectedAddress = useRecoilValue(legacySelectedAccountState)?.address
  const hasActiveAccount = selectedAddress !== undefined

  // remove urlAddresses when selectedAddress changes
  useEffect(() => {
    // check if an address is selected
    if (!selectedAddress) return

    // check if `address` is set in query string
    if (searchParams.getAll('address').length < 1) return

    // remove all instances of address
    searchParams.delete('address')

    // update react router + browser url
    setSearchParams(searchParams)
  }, [selectedAddress, searchParams, setSearchParams])

  const [fetchAddresses, setFetchAddresses] = useState(addresses)
  useEffect(() => {
    if (!hasActiveAccount) return setFetchAddresses(urlAddresses.length > 0 ? urlAddresses : addresses)
    // TODO: All addresses fetched from useActiveAccount, if All Accounts is selected, will result in undefined. Need to
    // Handle this better in the future
    setFetchAddresses([selectedAddress ?? ''])
  }, [addresses, hasActiveAccount, selectedAddress, urlAddresses])

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
      <header
        css={{
          'marginBottom': '1rem',
          'paddingBottom': '1rem',
          'display': 'flex',
          'justifyContent': 'space-between',
          'gap': '1.6rem',
          '.field-search': {
            width: '35rem',
          },
        }}
      >
        <Field.Search value={searchQuery} onChange={setSearchQuery} placeholder="Filter by Chain, Address, Type..." />
        <ExportTxHistoryWidget>
          {({ onToggleOpen }) => (
            <Button variant="outlined" onClick={onToggleOpen}>
              Export
            </Button>
          )}
        </ExportTxHistoryWidget>
      </header>
      <Panel
        css={css`
          > .inner {
            ::before,
            ::after {
              content: '';
              display: table;
            }
          }
        `}
      >
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore && status !== 'ERROR'}
          loader={
            <PanelSection
              key="loader"
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <MaterialLoader
                css={css`
                  margin: 0;
                `}
              />
              <div>{t('Searching the paraverse')}</div>
            </PanelSection>
          }
        >
          {Object.entries(dayGroupedTransactions).map(([day, transactions]) => (
            <Fragment key={`${day}-${selectedAddress}`}>
              <motion.h3
                css={css`
                  margin: 1.4rem;
                  color: white;

                  &:not(:first-child) {
                    margin-top: 3rem;
                  }
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
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
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <AlertCircle
                css={css`
                  display: block;
                  width: 1.2em;
                  height: 1.2em;
                `}
              />
              {t('No Transactions - try another account')}
            </PanelSection>
          )}

          {status === 'ERROR' && (
            <PanelSection
              css={centered}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { ease: [0.78, 0.14, 0.15, 0.86] } }}
            >
              <AlertCircle
                css={css`
                  display: block;
                  width: 1.2em;
                  height: 1.2em;
                `}
              />
              {t('An error occured')}
            </PanelSection>
          )}
        </InfiniteScroll>
      </Panel>

      <footer
        css={css`
          margin-top: 1rem;
          padding-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        {status === 'SUCCESS' && !hasMore && hasTransactions && (
          <div
            css={[
              centered,
              css`
                color: var(--color-mid);
              `,
            ]}
          >
            {t('Search complete')}
          </div>
        )}
      </footer>
    </section>
  )
}

const centered = css`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  > * {
    margin: 0 0.3em;
  }
`
