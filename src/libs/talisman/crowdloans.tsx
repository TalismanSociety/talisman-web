import { 
  createContext, 
  useContext
} from 'react'


const Context = createContext({});

const useCrowdloans = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {    
    return <Context.Provider 
      value={{
        crowdloans: []
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