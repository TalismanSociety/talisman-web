import { useLazyQuery } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'

import { TX_QUERY } from './consts'
import { TTransaction } from './types'

// consts
const FETCH_LIMIT = 5
const INITIAL_ID = '9999999999999--9999999999-999999-fffff--zzzzzzzz'

type reducerAction = {
  type: string
  data?: any
}

const transactionReducer = (state: TTransaction[], action: reducerAction) => {
  // add a TX to the state tx array
  const addTx = (tx: TTransaction) => {
    const txIds = state.map((tx: any) => tx.id)

    if (!txIds.includes(tx.id)) {
      state.push(tx)
      txIds.push(tx.id)
    }
  }

  // handle all actions
  switch (action.type) {
    case 'ADD':
      addTx(action.data)
      break
    case 'ADD_MULTI':
      action.data.forEach(addTx)
      break
    case 'CLEAR':
      state = []
      break
    default:
      break
  }

  // TODO: order here on return
  return [...state]
}

// fetch all transaction based on the address provided
export const useTransactions = (initialAddress: string | undefined) => {
  // the current address to query
  const [address, setAddress] = useState<string | undefined>(initialAddress)

  // the last id fetched so we know where to start the fetching next time
  // set this initially to a very large number - larger than the highest ID we can store
  // maybe a better way to do this is to handle undefined on the backend
  const [lastId, setLastId] = useState<string>(INITIAL_ID)

  // T/F boolean based on the number of results from the last query
  const [hasMore, setHasMore] = useState<boolean>(true)

  // the current data we have fetched
  const [transactions, dispatch] = useReducer(transactionReducer, [])

  // the current status of the data
  const [status, setStatus] = useState('INITIALISED')

  // create a query client
  const apolloClient = useMemo(() => {
    const uri = process.env.REACT_APP_TX_HISTORY_INDEXER || 'http://localhost:4350/graphql'

    return new ApolloClient({
      link: new BatchHttpLink({ uri, batchMax: 999, batchInterval: 20 }),
      cache: new InMemoryCache(),
    })
  }, [])

  // the query object
  const [getTxs, { data = [], loading, error }] = useLazyQuery(TX_QUERY, { client: apolloClient })

  // handle new incoming data
  useEffect(() => {
    if (!!loading || !!error) return

    const txs = data?.transactionsByAddress || []

    if (!txs.length) {
      setHasMore(false)
      return
    }

    dispatch({ type: 'ADD_MULTI', data: [...txs] })
    setHasMore(txs.length >= FETCH_LIMIT)
    setStatus('SUCCESS')
  }, [loading, error, data])

  // handle updating the status of the query when the loading or error states change
  useEffect(() => {
    // if we're loading
    if (!!loading) {
      setStatus('PROCESSING')
    }
    // else error
    else if (!!error) {
      setStatus('ERROR')
    }
    // else all good
    else {
      setStatus('SUCCESS')
    }
  }, [loading, error])

  // clear existing items when address is changed
  useEffect(() => {
    if (!address) return

    // reset the last ID to a high number
    setLastId(INITIAL_ID)

    // TODO: race condition sometimes when apollo is cached
    dispatch({ type: 'CLEAR' })
  }, [address])

  // trigger refetch if address or lastID change
  useEffect(() => {
    if (!address) return
    getTxs({ variables: { address, lastId, count: FETCH_LIMIT } })
  }, [address, lastId, getTxs])

  // fetch more by updating the lastId
  // we can only set the lastID if we have > 1 TXs
  // this will trigger refetch
  const loadMore = useCallback(() => {
    // dispatch({type: 'CLEAR'})
    !!transactions.length && setLastId(transactions[transactions.length - 1].id)
  }, [transactions])

  return {
    changeAddress: setAddress,
    address,
    loadMore,
    hasMore,
    transactions,
    status,
  }
}

type TXCategories = {
  [key: string]: string[]
}

const txCategories: TXCategories = {
  Transfer: ['balances.transfer', 'balances.transferKeepAlive', 'balances.transferAll'],
  System: ['system.remark', 'system.remark_with_event'],
  Staking: ['staking.bond', 'staking.unbond', 'staking.withdraw_unbonded'],
  Crowdloan: [
    'crowdloan.add_memo',
    'crowdloan.contribute',
    'crowdloan.contribute_all',
    'crowdloan.create',
    'crowdloan.dissolve',
    'crowdloan.edit',
    'crowdloan.poke',
    'crowdloan.refund',
    'crowdloan.withdraw',
  ],
  Batch: ['utility.batch', 'utility.batch_all'],
}

export const useTypeCategory = (extrinsicType: string) => {
  const typeCategory = Object.keys(txCategories).find((key: string) => txCategories[key].includes(extrinsicType))
  if (!typeCategory) return { typeCategory: extrinsicType }

  return { typeCategory }
}

export const externalURLDefined = (chainId: string, blockNumber: string, indexInBlock: string) => {
  const externalURL = `https://${chainId}.subscan.io/extrinsic/${blockNumber}-${indexInBlock}`

  return externalURL
}
