import { 
  createContext, 
  useContext,
  useState,
  useReducer,
  useEffect,
  useCallback
} from 'react'
import {
  //web3AccountsSubscribe,
  web3Accounts,
  web3Enable,
  //web3FromAddress,
  //web3ListRpcProviders,
  //web3UseRpcProvider
} from '@polkadot/extension-dapp';
import { 
  useStatus, 
  useAwaitObjectValue 
} from './util/hooks'
import { useApi } from '@libs/talisman'



// account store reducer
// receive an address and some fields, and update internal state
// [todo] ensure fields prop is valid obj & confirms to certain shape
const accountReducer = (state={}, {address, fields={}, callback=()=>{}}) => {
  const newState = {...state}

  // we have this address already? then update
  if(!!state[address]){
    
    newState[address] = {
      ...newState[address],
      address: address,
      ...fields
    }
  }
  // address doesn't exist? insert & update
  else{
    newState[address] = {
      address: address,
      ...fields
    }
  }

  callback && callback(newState[address])

  return newState
}

const Context = createContext({});

const useGuardian = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {
    const [injected, setInjected] = useState()
    const [accounts, update] = useReducer(accountReducer, {})
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

    // as a result of the window?.injectedWeb3 object not always being immediately available
    // we set up a watcher here to monitor the object value and trigger the init process
    // once available
    useAwaitObjectValue(
      window, // watch the window object
      'injectedWeb3.polkadot-js', // for this keys' value (dot delimited - ala lodash get)
      val => init(), // trigger this callback when it's available
      100 // check interval,
    )

    // init polkadot.js once the plugin has been found
    const init = async () => {
      const injected = await web3Enable('Talisman');
      
      // do we have the talisman plugin enabled?
      if (!injected[0]) {
          setStatus('UNAUTHORIZED', `The polkadot.js extension is not authorized to interact with this application. [...info on how to auth]`)
          return 
      }
      else{
        setInjected(injected[0])
      }

      // fetch all available user accounts
      const accounts = await web3Accounts();

      // does the user have accounts configured?
      if(accounts.length <= 0){
        setStatus('NOACCOUNT', 'Please create an account/address in the polkadot.js extension to be able to interact with this application')
      }else{
        setStatus('AUTHORIZED', 'The polkadot.js extension is installed and authorized, and accounts have been found')
        
        // itterate through accounts and insert into state/reducer
        accounts.forEach(account => {
          update({
            address: account.address,
            fields: {
              name: account?.meta?.name,
              hydrate: () => hydrateAccount(account.address)
            },
            callback: () => hydrateAccount(account.address)
          })
        })

        setStatus('AUTHORIZED', 'The polkadot.js extension is installed and authorized, and accounts have been found')
      }
    }

    // [todo] hydrate other account information such as balance etc... 
    // [todo] need to memoize!!
    const hydrateAccount = useCallback(async address => {
      //if(!api.isReady) return

      update({
        address: address,
        fields: {
          balance: {
            hydrating: true
          }
        }
      })

      const { data: balance } = await api.query.system.account(address);

      const total = balance.free.toString()
      const reserve = 1
      const available = total - reserve

      update({
        address: address,
        fields: {
          balance: {
            total,
            reserve,
            available,
            hydrating: false
          }
        }
      })
    })

    return <Context.Provider 
      value={{
        accounts: Object.values(accounts),
        injected: injected,
        ready: status === options.AUTHORIZED,
        status: status,
        message: message,
      }}
      >
      {children}
    </Context.Provider>
  }

const _guardian = {
  Provider,
  useGuardian
}

export default _guardian