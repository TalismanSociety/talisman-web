import { createContext, useContext, useEffect, useReducer, useState } from 'react'

import { SupportedRelaychains } from './util/_config'

const settingsReducer = (state = {}, data) => {
  const newState = {
    ...state,
    ...data,
  }

  return newState
}

const Context = createContext({})

const useSettings = () => useContext(Context)

const Provider = ({ children }) => {
  const [settings, updateSettings] = useReducer(settingsReducer)
  const [chainId, setChainId] = useState(process.env.REACT_APP_DEFAULT_CHAIN_ID || 2)

  const hydrateChainDetails = id => {
    updateSettings({
      chain: {
        id: id,
        ...SupportedRelaychains[id],
        status: !!SupportedRelaychains[id] ? 'VALID' : 'INVALID',
      },
    })
  }

  useEffect(() => !!chainId && hydrateChainDetails(chainId), [chainId])

  return (
    <Context.Provider
      value={{
        ...settings,
        setChainId,
      }}
    >
      {children}
    </Context.Provider>
  )
}

const Settings = {
  Provider,
  useSettings,
}

export default Settings
