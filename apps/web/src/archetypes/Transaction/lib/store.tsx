import { useQuery } from '@apollo/client'
import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
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

type ReducerState = {
  txs: TransactionMap
  sortedIds: string[]
  oldestId?: string
  latestId?: string
}

const reducerInitState = { txs: {}, sortedIds: [] }

const transactionReducer = (state: ReducerState, action: ReducerAction): ReducerState => {
  // add new txs
  const addTxs = (state: TransactionMap, txs: Transaction[]) => ({
    ...state,
    ...Object.fromEntries(txs.map(tx => [tx.id, tx])),
  })

  // sort ids and get oldest + latest id
  const sortIds = (txs: TransactionMap) => {
    const sortedIds = Object.keys(txs).sort()
    return {
      sortedIds,
      oldestId: sortedIds[0],
      latestId: sortedIds.slice(-1)[0],
    }
  }

  // handle all actions
  switch (action.type) {
    case 'ADD':
      const txs = addTxs(state.txs, Array.isArray(action.data) ? action.data : [action.data])
      return { txs, ...sortIds(txs) }
    case 'CLEAR':
      return reducerInitState

    default:
      // force compilation error if any action types don't have a case
      const exhaustiveCheck: never = action
      throw new Error(`Unhandled action type ${exhaustiveCheck}`)
  }
}

// fetch all transaction based on the addresses provided
export const useTransactions = (_addresses: string[], searchQuery?: string) => {
  // create an apollo client
  const apolloClient = useTxHistoryApolloClient()

  // memoize addresses
  const addresses = useMemo(
    () => _addresses,
    [JSON.stringify(_addresses)] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // indicates whether or not there are more pages of data available to be fetched from the api
  const [hasMore, setHasMore] = useState(true)

  // indicates whether or not the user wants us to load the next page of data from the api
  const [wantMore, setWantMore] = useState(true)

  // a callback to request more data
  const loadMore = useCallback(() => setWantMore(true), [])

  // the current data we have fetched
  const [{ txs, oldestId, latestId }, dispatch] = useReducer(transactionReducer, reducerInitState)

  // the current status of the data
  const [status, setStatus] = useState<TransactionsStatus>('INITIALISED')

  // clear existing txs when addresses or searchQuery is changed
  useEffect(() => {
    // update the status
    setStatus('INITIALISED')

    // clear the store
    dispatch({ type: 'CLEAR' })

    // fetch new data
    loadMore()
  }, [addresses, searchQuery, loadMore])

  // the tx query
  useEffect(() => {
    if (!wantMore) return

    let cancelled = false
    apolloClient
      .query({
        query: txQuery,
        variables: { addresses, searchQuery, olderThanId: oldestId, limit: FETCH_LIMIT },
      })
      .then(({ data, loading, error }) => {
        // if we've cancelled this query (variables have changed since the query was made)
        if (cancelled) return

        // if we're loading
        if (loading) return setStatus('PROCESSING')

        // if we have an error
        if (error) {
          console.error('Failed to fetch txs for tx history', error)
          setHasMore(false)
          setWantMore(false)
          setStatus('ERROR')
          return
        }

        const transactions =
          // ignore the results if we didn't provide any addresses
          addresses.length === 0 ? [] : data?.transactionsByAddress ?? []

        dispatch({ type: 'ADD', data: transactions })
        setHasMore(transactions.length >= FETCH_LIMIT)

        setWantMore(false)
        setStatus('SUCCESS')
      })
      .catch(error => {
        console.error('Failed to fetch txs for tx history (network error)', error)
        setHasMore(false)
        setWantMore(false)
        setStatus('ERROR')
        return
      })

    return () => {
      // cancel any queries we've made which haven't been completed yet
      cancelled = true
    }
  }, [apolloClient, addresses, oldestId, searchQuery, wantMore])

  // subscribe to the latest tx id, then fetch some more txs
  // starting from the most recent (instead of oldest) when
  // no tx with the latest id exists in the store
  const latestTxIdOnServer = useLatestTxIdSubscription(apolloClient, addresses, searchQuery)
  const latestTxIdInStore = latestId
  useEffect(() => {
    // don't fetch more recent txs if we're still fetching the latest tx id
    if (latestTxIdOnServer === undefined) return

    // don't fetch more recent txs unless tx fetcher is idle
    if (wantMore) return
    if (status !== 'SUCCESS') return

    // don't fetch more recent txs if we already have the latest tx
    if (txs[latestTxIdOnServer] !== undefined) return

    // fetch more recent txs
    let cancelled = false
    apolloClient
      .query({
        query: txQuery,
        variables: { addresses, searchQuery, newerThanId: latestTxIdInStore, limit: FETCH_LIMIT },
      })
      .then(({ data, loading, error }) => {
        // if we've cancelled this query (variables have changed since the query was made)
        if (cancelled) return

        // if we're loading
        if (loading) return

        // if we have an error
        if (error) return console.warn('Failed to fetch recent txs for tx history', error)

        const transactions =
          // ignore the results if we didn't provide any addresses
          addresses.length === 0 ? [] : data?.transactionsByAddress ?? []

        dispatch({ type: 'ADD', data: transactions })
      })
      .catch(error => console.error('Failed to fetch recent txs for tx history (network error)', error))

    return () => {
      // cancel any queries we've made which haven't been completed yet
      cancelled = true
    }
  }, [latestTxIdInStore, status, txs, apolloClient, addresses, searchQuery, latestTxIdOnServer, wantMore])

  return {
    loadMore,
    hasMore,
    transactions: txs,
    status,
  }
}

function useTxHistoryApolloClient() {
  return useMemo(() => {
    const uri = process.env.REACT_APP_TX_HISTORY_INDEXER || 'http://localhost:4350/graphql'

    return new ApolloClient({
      link: new BatchHttpLink({ uri, batchMax: 999, batchInterval: 20 }),
      cache: new InMemoryCache(),
    })
  }, [])
}

function useLatestTxIdSubscription(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  addresses: string[],
  searchQuery?: string
) {
  const pollInterval = 5_000 // 5 seconds in ms
  const { data: latestTxData } = useQuery(latestTxQuery, {
    client: apolloClient,
    variables: { addresses, searchQuery },
    pollInterval,
  })
  return latestTxData?.transactionsByAddress[0]?.id
}
