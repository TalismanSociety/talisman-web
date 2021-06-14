import { 
  createContext, 
  useContext,
  useState,
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

const Context = createContext({});

const useGuardian = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {
    const [injected, setInjected] = useState()
    const [accounts, setAccounts] = useState([])

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
      
      if (!injected[0]) {
          setStatus('UNAUTHORIZED', `The polkadot.js extension is not authorized to interact with this application. [...info on how to auth]`)
          return 
      }
      else{
        setInjected(injected[0])
      }

      const accounts = await web3Accounts();

      if(accounts.length <= 0){
        setStatus('NOACCOUNT', 'Please create an account/address in the polkadot.js extension to be able to interact with this application')
      }else{
        setAccounts(accounts)
        setStatus('AUTHORIZED', 'The polkadot.js extension is installed and authorized')
      }
    }

    return <Context.Provider 
      value={{
        accounts: accounts,
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