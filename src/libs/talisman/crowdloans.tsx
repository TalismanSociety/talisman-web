import { 
  createContext, 
  useContext,
  useState,
  useReducer,
  useEffect
} from 'react'
import { 
  useStatus, 
  useAwaitObjectValue 
} from './util/hooks'

import { ApiPromise, WsProvider } from '@polkadot/api';


// crowdload store/reducer
// receive an address and some fields, and update internal state
// [todo] ensure fields prop is valid obj & confirms to certain shape
const crowdloadReducer = (state={}, {address, fields={}, callback=()=>{}}) => {
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

const useCrowdloans = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {
    const [crowdloans, update] = useReducer(crowdloadReducer, {})
    
    return <Context.Provider 
      value={{
        crowdloans: Object.values(crowdloans)
      }}
      >
      {children}
    </Context.Provider>
  }

const _guardian = {
  Provider,
  useCrowdloans
}

export default _guardian