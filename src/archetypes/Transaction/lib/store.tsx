import { useQuery } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { FETCH_LIMIT, latestTxQuery, txQuery } from './consts'
import { Transaction } from './graphql-codegen/graphql'

type TransactionsStatus = 'INITIALISED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'
type TransactionMap = Record<string, Transaction>

type ReducerAction =
  // Add txs
  | { type: 'ADD'; data: Transaction | Transaction[] }
  // Remove all txs
  | { type: 'CLEAR' }

const transactionReducer = (state: TransactionMap, action: ReducerAction): TransactionMap => {
  // add new txs
  const addTxs = (state: TransactionMap, txs: Transaction[]) => ({
    ...state,
    ...Object.fromEntries(txs.map(tx => [tx.id, tx])),
  })

  // handle all actions
  switch (action.type) {
    case 'ADD':
      return addTxs(state, Array.isArray(action.data) ? action.data : [action.data])
    case 'CLEAR':
      return {}

    default:
      // force compilation error if any action types don't have a case
      const exhaustiveCheck: never = action
      throw new Error(`Unhandled action type ${exhaustiveCheck}`)
  }
}

// fetch all transaction based on the addresses provided
export const useTransactions = (_addresses: string[]) => {
  // memoize addresses
  const addresses = useMemo(
    () => _addresses,
    [JSON.stringify(_addresses)] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // the oldest id fetched so we know where to start the fetching next time
  // set this initially to a very large number - larger than the highest ID we can store
  // maybe a better way to do this is to handle undefined on the backend
  const [oldestId, setOldestId] = useState<string | undefined>()

  // T/F boolean based on the number of results from the last query
  const [hasMore, setHasMore] = useState<boolean>(true)

  // the current data we have fetched
  const [transactions, dispatch] = useReducer(transactionReducer, {})

  // the current status of the data
  const [status, setStatus] = useState<TransactionsStatus>('INITIALISED')

  // create an apollo client
  const apolloClient = useMemo(() => {
    const uri = process.env.REACT_APP_TX_HISTORY_INDEXER || 'http://localhost:4350/graphql'

    return new ApolloClient({
      link: new BatchHttpLink({ uri, batchMax: 999, batchInterval: 20 }),
      cache: new InMemoryCache(),
    })
  }, [])

  // the tx query
  const { data, loading, error } = useQuery(txQuery, {
    client: apolloClient,
    variables: { addresses, olderThanId: oldestId, limit: FETCH_LIMIT },
  })

  // clear existing items when addresses is changed
  useEffect(() => {
    setStatus('INITIALISED')

    // reset the oldest ID
    setOldestId(undefined)

    // clear the store
    dispatch({ type: 'CLEAR' })
  }, [addresses])

  useEffect(() => {
    // if we're loading
    if (loading) return setStatus('PROCESSING')
    // or have an error
    if (error) return setStatus('ERROR')

    const transactions = data?.transactionsByAddress || []

    dispatch({ type: 'ADD', data: transactions })
    setHasMore(transactions.length >= FETCH_LIMIT)

    setStatus('SUCCESS')
  }, [loading, error, data])

  // fetch more by updating the oldestId
  // we can only set the oldestId if we have > 0 TXs
  // this will trigger refetch
  const loadMore = useCallback(() => {
    const sortedTransactionIds = Object.keys(transactions).sort((a, b) => b.localeCompare(a))
    if (sortedTransactionIds.length < 1) return

    setOldestId(sortedTransactionIds.slice(-1)[0])
  }, [transactions])

  // subscribe to the latest tx id,
  // then fetch more txs starting from the most recent (instead of oldest)
  // when the latest tx id can't be found in the store
  const pollInterval = 5_000 // 5 seconds in ms
  const { data: latestTxData } = useQuery(latestTxQuery, {
    client: apolloClient,
    variables: { addresses },
    pollInterval,
  })
  const latestTxId = latestTxData?.events[0]?.id
  const latestTxIdInStore = useMemo(() => {
    const sortedTransactionIds = Object.keys(transactions).sort((a, b) => b.localeCompare(a))
    return sortedTransactionIds[0]
  }, [transactions])
  useEffect(() => {
    // don't fetch more recent txs if we're still fetching the latest tx id
    if (latestTxId === undefined) return

    // don't fetch more recent txs unless tx fetcher is idle
    if (status !== 'SUCCESS') return

    // don't fetch more recent txs if we already have the latest tx
    if (Object.keys(transactions).includes(latestTxId)) return

    // fetch more recent txs
    let cancelled = false
    apolloClient
      .query({ query: txQuery, variables: { addresses, newerThanId: latestTxIdInStore, limit: FETCH_LIMIT } })
      .then(({ data, loading, error }) => {
        if (cancelled) return
        if (loading) return
        if (error) return console.warn('Failed to fetch recent txs for tx history', error)

        const transactions = data.transactionsByAddress || []
        dispatch({ type: 'ADD', data: transactions })
      })

    return () => {
      // cancel any queries we've made which haven't been completed yet
      cancelled = true
    }
  }, [latestTxId, latestTxIdInStore, status, transactions, apolloClient, addresses])

  return {
    loadMore,
    hasMore,
    transactions,
    status,
  }
}
