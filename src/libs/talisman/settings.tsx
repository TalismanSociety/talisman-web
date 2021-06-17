import { 
  createContext, 
  useContext,
  useState,
  useReducer
} from 'react'

const chainOptions = {
  polkadot: {
    name: 'Polkadot',
    rpc: 'wss://rpc.polkadot.io',
  },
  kusama: {
    name: 'Kusama',
    rpc: 'wss://kusama-rpc.polkadot.io',
  },
  rococo: {
    name: 'Rococo',
    rpc: 'wss://rococo-rpc.polkadot.io',
  },
  westend: {
    name: 'Westend',
    rpc: 'wss://westend-rpc.polkadot.io',
  },
}

const settingsReducer = (state={}, data) => {
  const newState = {
    ...state,
    ...data
  }

  return newState
}

const Context = createContext({});

const useSettings = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {

    // const [settings, setState] = useState({
    //   rpc: 'wss://kusama-rpc.polkadot.io'
    // })

    const [ settings, updateSettings] = useReducer(settingsReducer, {
      chain: chainOptions[process.env.REACT_APP_DEFAULT_CHAIN_NAME||'rococo']
    })

    const setChain = name => {
      if(chainOptions[name]){
        updateSettings({
          chain: chainOptions[name]
        })
      }
    }

    return <Context.Provider 
      value={{
        ...settings,
        setChain
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