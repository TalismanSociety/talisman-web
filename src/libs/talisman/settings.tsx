import { 
  createContext, 
  useContext,
  useState
} from 'react'

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
        ...settings,
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