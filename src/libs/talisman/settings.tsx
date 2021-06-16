import { 
  createContext, 
  useContext,
  useState,
  useReducer,
  useEffect
} from 'react'
import { 
  useStatus, 
} from './util/hooks'
import { ApiPromise, WsProvider } from '@polkadot/api';

const Context = createContext({});

const useSettings = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {

    const settings = useState({
      rpc: 'wss://rpc.polkadot.io'
    })

    return <Context.Provider 
      value={{
        rpc: 'wss://rpc.polkadot.io',
        /*: (key, val) => {
          if(!!Object.keys(settings)[key]){
            const newState = {...state}
            newState[key] = value
            setState(newState)
          }
        }*/
      }}
      >
      {children}
    </Context.Provider>
  }

const _settings = {
  Provider,
  useSettings
}

export default _settings