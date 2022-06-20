import { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
import { useLazyQuery } from "@apollo/client";
import { TTransaction } from './types';
import { TX_QUERY } from './consts';
import { ApolloClient, InMemoryCache, NormalizedCacheObject, gql, useQuery } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

const fetchLimit = 5

type reducerAction = {
	type: string, 
	data?: any
}

const transactionReducer = (state: TTransaction[], action: reducerAction) => {
	
	// add a TX to the state tx array
	const addTx = (tx: TTransaction) => {
		const txIds = state.map((tx: any) => tx.id)

		if(!txIds.includes(tx.id)){
			state.push(tx)
			txIds.push(tx.id)
		}
	}

	// handle all actions
	switch (action.type) {
		case "ADD":
			addTx(action.data)
			break
		case "ADD_MULTI":
			action.data.forEach(addTx)
			break
		case "CLEAR":
			state = []
			break
		default:
			break
	}

	// TODO: order here on return
	return [...state];
};


// add the transaction fetching hook here
export const useTransactions = (initialAddress: string) => {
	// the current address to query
	const [address, setAddress] = useState<string>(initialAddress)

	// the last id fetched so we know where to start the fetching next time
	// set this initially to a very large number - larger than the highest ID we can store
	// maybe a better way to do this is to handle undefined on the backend
	const [lastId, setLastId] = useState<string>('9999999999999999999999999999999999')

	// T/F boolean based on the number of results from the last query
	const [hasMore, setHasMore] = useState<boolean>(true)
	
	// the current data we have fetched
	const [transactions, dispatch] = useReducer(transactionReducer, []);

	// the current status of the data
	const [status, setStatus] = useState("INITIALISED")

	// create a query client
	const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: new BatchHttpLink({ uri: 'http://localhost:4350/graphql', batchMax: 999, batchInterval: 20 }),
        cache: new InMemoryCache(),
      }),
    []
  )

	// the query object
	const [getTxs, { data = [], loading, error }] = useLazyQuery(TX_QUERY, {client: apolloClient });

	// handle new incoming data
	useEffect(() => {
		if(!!loading||!!error) return

		const txs = data?.transactionsByAccount||[]
		
		if(!txs.length) {
			setHasMore(false)
			return
		}

		dispatch({type: 'ADD_MULTI', data: [...txs]})
		setHasMore(txs.length >= fetchLimit)
		setStatus("SUCCESS")
	}, [loading, error, data])

	// handle updating the status of the query when the loading or error states change
	useEffect(() => {
		console.log({loading, error})
		// if we're loading
		if(!!loading){
			setStatus("PROCESSING")
		}
		// else error
		else if(!!error){
			setStatus("ERROR")
		}
		// else all good
		else{
			setStatus("SUCCESS")
		}
	}, [loading, error])

	// clear existing items when address is changed
	useEffect(() => {
		if(!address) return
		// TODO: race condition sometimes when apollo is cached
		dispatch({type: 'CLEAR'})
	}, [address])
	
	
	// trigger refetch if address or lastID change
	useEffect(() => {
		if(!address) return
		getTxs({variables: { address, lastId, count: fetchLimit }})
	}, [address, lastId, getTxs])


	// fetch more by updating the lastId
	// we can only set the lastID if we have > 1 TXs
	// this will trigger refetch
	const loadMore = useCallback(() => {
		!!transactions.length && setLastId(transactions[transactions.length-1].id)
	}, [transactions])

	return {
		changeAddress: setAddress,
		loadMore,
		hasMore,
		transactions,
		status
	}
}

type TXCategories = {
	[key: string]: string[]
}

const txCategories : TXCategories = {
	Transfer : [
		'balances.transfer',
		'balances.transferKeepAlive',
		'balances.transfer_all'
	],
	System : [
		'system.remark',
		'system.remark_with_event',
	],
	Staking : [
		'staking.bond',
		'staking.unbond',
		'staking.withdraw_unbonded',
	],
	Crowdloan: [
		'crowdloan.add_memo',
		'crowdloan.contribute',
		'crowdloan.contribute_all',
		'crowdloan.create',
		'crowdloan.dissolve',
		'crowdloan.edit',
		'crowdloan.poke',
		'crowdloan.refund',
		'crowdloan.withdraw'
	],
	Batch : [
		'utility.batch',
		'utility.batch_all'
	]
}


export const useTypeCategory = ( extrinsicType : string ) => {

	const typeCategory = Object.keys(txCategories).find((key: string) => txCategories[key].includes(extrinsicType))
	if(!typeCategory) return { typeCategory : "Other"}

	return { typeCategory }
}