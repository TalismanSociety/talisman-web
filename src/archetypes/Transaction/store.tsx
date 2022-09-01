import { useQuery } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import moment from 'moment-timezone'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { FETCH_LIMIT, TX_QUERY } from './consts'
import { IndexerTransaction, Transaction, TransactionMap } from './types'
import { getBlockExplorerUrl, parseTransaction } from './util'

type TransactionsStatus = 'INITIALISED' | 'PROCESSING' | 'ERROR' | 'SUCCESS'

type ReducerAction =
  // Add txs
  | { type: 'ADD'; data: IndexerTransaction | IndexerTransaction[] }
  // Remove all txs
  | { type: 'CLEAR' }

const transactionReducer = (state: TransactionMap, action: ReducerAction): TransactionMap => {
  // convert IndexerTransaction (what comes back from the API) into Transaction (what we use in the app)
  const transformIndexerTx = (tx: IndexerTransaction): Transaction => ({
    ...tx,

    timestamp: moment(tx.timestamp),
    relatedAddresses: tx.relatedAddresses.split('.'),

    blockExplorerUrl: getBlockExplorerUrl(tx),
    parsed: parseTransaction(tx),
  })

  // add new txs
  const addTxs = (state: TransactionMap, txs: IndexerTransaction[]) => ({
    ...state,
    ...Object.fromEntries(txs.map(tx => [tx.id, transformIndexerTx(tx)])),
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

  // the last id fetched so we know where to start the fetching next time
  // set this initially to a very large number - larger than the highest ID we can store
  // maybe a better way to do this is to handle undefined on the backend
  const [lastId, setLastId] = useState<string | undefined>()

  // T/F boolean based on the number of results from the last query
  const [hasMore, setHasMore] = useState<boolean>(true)

  // the current data we have fetched
  const [transactions, dispatch] = useReducer(transactionReducer, {})

  // the current status of the data
  const [status, setStatus] = useState<TransactionsStatus>('INITIALISED')

  // create a query client
  const apolloClient = useMemo(() => {
    const uri = process.env.REACT_APP_TX_HISTORY_INDEXER || 'http://localhost:4350/graphql'

    return new ApolloClient({
      link: new BatchHttpLink({ uri, batchMax: 999, batchInterval: 20 }),
      cache: new InMemoryCache(),
    })
  }, [])

  // the query object
  const {
    data = [],
    loading,
    error,
  } = useQuery(TX_QUERY, {
    client: apolloClient,
    variables: { addresses, lastId, limit: FETCH_LIMIT },
  })

  // clear existing items when addresses is changed
  useEffect(() => {
    // reset the last ID
    setLastId(undefined)

    // clear the store
    dispatch({ type: 'CLEAR' })
  }, [addresses])

  useEffect(() => {
    // if we're loading
    if (loading) return setStatus('PROCESSING')
    // or have an error
    if (error) return setStatus('ERROR')

    const transactions = data?.transactionsByAddress || []

    dispatch({ type: 'ADD', data: [...transactions] })
    setHasMore(transactions.length >= FETCH_LIMIT)

    setStatus('SUCCESS')
  }, [loading, error, data])

  // fetch more by updating the lastId
  // we can only set the lastID if we have > 0 TXs
  // this will trigger refetch
  const loadMore = useCallback(() => {
    const sortedTransactionIds = Object.keys(transactions).sort((a, b) => b.localeCompare(a))
    if (sortedTransactionIds.length < 1) return

    setLastId(sortedTransactionIds.slice(-1)[0])
  }, [transactions])

  return {
    loadMore,
    hasMore,
    transactions,
    status,
  }
}
