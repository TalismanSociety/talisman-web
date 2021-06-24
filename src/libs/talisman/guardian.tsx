import { 
  createContext, 
  useContext,
  useState,
  useReducer,
  useEffect,
} from 'react'
import {
  //web3AccountsSubscribe,
  web3Accounts,
  web3Enable,
  //web3FromAddress,
  //web3ListRpcProviders,
  //web3UseRpcProvider
} from '@polkadot/extension-dapp';
import { get } from 'lodash'
import { 
  useStatus, 
  useAwaitObjectValue 
} from './util/hooks'
import { useApi } from '@libs/talisman'


// account store/reducer
// receive an address and some fields, and update internal state
// [todo] ensure fields prop is valid obj & confirms to certain shape
const accountReducer = (state={}, {type, callback=()=>{}, ...props}) => {
  const newState = {...state}

  switch (type) {
    case 'addBatch':
      // itterate items
      props.accounts.forEach(({address, meta}) => {
        // add new item by address
        if(!newState[address]){
          newState[address] = {
            address: address,
            name: meta?.name,
            balance: {
              total: null,
              reserve: null,
              available: null,
              hydrating: true
            },
          }
        }
      })
      break
    case 'update': 
      // check we have existing item?    
      if(!!newState[props?.address]){
        newState[props?.address] = {
          ...newState[props?.address],
          ...props,
          address: props?.address,
        }
      }
      break
    default: break
  }

  callback && callback(newState)

  return newState
}

// metadata store
// [todo] validate data keys and types 
const metadataReducer = (state={}, data) => {
  const newState = {
    ...state,
    ...data
  }

  return newState
}

// subscription store
// [todo] should abstract away into own lib
// [todo] should batch subscriptions by key (endpoint), somehow?
const subscriptionReducer = (state=[], sub) => {
  return [
    ...state,
    sub
  ]
}

const Context = createContext({});

const useGuardian = () => useContext(Context)

// helper hook to extract a key -> value usinf lodash.get dot format
const useGuardianValue = value => {
  const context = useContext(Context)
  return get(context, value)
}

const Provider = 
  ({
    children
  }) => {
    const [injected, setInjected] = useState()
    const [accounts, accountDispatcher] = useReducer(accountReducer, {})
    const [metadata, updateMetadata] = useReducer(metadataReducer, {})
    const [subscriptions, setSubscription] = useReducer(subscriptionReducer, [])
    const api = useApi()
    const { 
      status,
      message,
      setStatus,
      options
    } = useStatus({
      status: 'UNAVAILABLE',
      message: 'This website requires that the <a href="https://polkadot.js.org/extension/" target="_blank">polkadot.js extension</a> is installed before interacting with this application',
      customOptions: {
        UNAVAILABLE: 'UNAVAILABLE',
        AUTHORIZED: 'AUTHORIZED',
        UNAUTHORIZED: 'UNAUTHORIZED'
      }
    })

    // methods ---

    // init the application
    const initApplication = async () => {
      try{
        const injected = await web3Enable(process.env.REACT_APP_APPLICATION_NAME);

        // do we have the talisman plugin enabled?
        if (!injected[0]) {
            setStatus('UNAUTHORIZED', `The polkadot.js extension is not authorized to interact with this application. [...info on how to auth]`)
        }
        else{
          setInjected(injected[0])
        }
      } catch ({message}) {
        setInjected()
        setStatus('UNAUTHORIZED', message)
      }
      
    }

    const hydrateAccounts = async () => {
      if(!injected) return

      // fetch all available user accounts
      const accounts = await web3Accounts();

      // does the user have accounts configured?
      if(accounts.length <= 0){
        setStatus('NOACCOUNT', 'Please create an account/address in the polkadot.js extension to be able to interact with this application')
      }else{        
        // itterate through accounts and insert into state/reducer

        accountDispatcher({
          type: 'addBatch', 
          accounts: accounts,
          callback: () => setStatus('AUTHORIZED', 'The polkadot.js extension is installed and authorized, and accounts have been found')
        })

        setStatus('AUTHORIZED', 'The polkadot.js extension is installed and authorized, and accounts have been found')
      }
    }

    const initBalanceSubscriptions = async () => {
      if(!api.isReady || !Object.keys(accounts).length) return

      Object.keys(accounts).forEach(async address => {
        const balancesSub = await api.query.system.account(address, ({ data: balance }) => {
          const total = balance.free.toString()
          const reserve = 1
          const available = +total - reserve <= 0 ? 0 : +total - reserve

          accountDispatcher({
            type: 'update',
            address: address,
            balance: {
              total,
              reserve,
              available,
              hydrating: false
            }
          })
        });

        setSubscription(balancesSub)
      })
    }

    // we gather information about the chain and subscribe to
    // relevant subscriptions
    const hydrateMetadata = async () => {
      if(!api.isReady) return

      //const props = await api.rpc.system.properties()

      // fetch/set some relevant information
      Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.name(),
        api.rpc.system.version(),
        api.rpc.system.properties()
      ]).then(
        ([
          chain, 
          nodeName, 
          nodeVersion,
          properties
        ]) => {
          updateMetadata({
            chain: chain.toString(),
            nodeName: nodeName.toString(),
            nodeVersion: nodeVersion.toString(),
            tokenSymbol: properties.tokenSymbol.value[0].toString(),
            tokenDecimals: properties.tokenDecimals.value[0].toString(),
            blockPeriod: 6
          })
        }
      )

      // we want the latest header info
      // [todo] handle rejection of multiple subs of the same kind, 
      // some sort of batching would be better. ok for now
      const headsSub = await api.rpc.chain.subscribeNewHeads(header => {
        updateMetadata({
          blockNumber: header.number.toNumber(),
          blockHash: header.hash.toString()
        })
      });

      setSubscription(headsSub)
    }

    
    // hooks ---
    // we need to perform a bunch of things in series, all dependent on certain 
    // paramaters being set/available. To do this we've set up some hooks to await
    // required variables, and trigger the appropriate callback when validation
    // criteria is met

    // step 1 ---
    // as a result of the window?.injectedWeb3 object not always being immediately available
    // we set up a watcher here to monitor the object value and trigger the init process
    // once available
    useAwaitObjectValue(
      window, // watch the window object
      'injectedWeb3.polkadot-js', // for this keys' value (dot delimited - ala lodash get)
      () => initApplication(), // trigger this callback when it's available
      100 // check interval,
    )

    // step 2 ---
    // hydrate accounts when injected is available
    useEffect(() => !!injected && hydrateAccounts(), [injected]) // eslint-disable-line

    // step 3 ---
    // API is ready, we can hydrate metadata
    useEffect(() => !!api.isReady && hydrateMetadata(), [api.isReady]) // eslint-disable-line

    // step 4 ---
    // hydrate balances once the polkadot API is connected/ready & we have some accounts
    useEffect(() => !!api.isReady && status === options.AUTHORIZED && initBalanceSubscriptions(), [api.isReady, Object.values(accounts).length]) // eslint-disable-line

    
    // cleanup ---
    // we want to make sure all subscriptions are unsubscribed on unmount
    // will most likely never be used because this is core to the system and will never unmount
    // although helps with react hot reloading 
    useEffect(() => {
      return () => (subscriptions||[]).map(unsub => unsub && unsub())
    }, [])  // eslint-disable-line

    return <Context.Provider 
      value={{
        accounts: Object.values(accounts),
        metadata: metadata,
        ready: status === options.AUTHORIZED,
        status: status,
        message: message,
      }}
      >
      {children}
    </Context.Provider>
  }

const Guardian = {
  Provider,
  useGuardian,
  useGuardianValue
}

export default Guardian