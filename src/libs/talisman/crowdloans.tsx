import { 
  createContext, 
  useContext,
  useEffect
} from 'react'
import { useApi } from '@libs/talisman'

const Context = createContext({});

const useCrowdloans = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {

    const api = useApi()

    const hydrateItems = async () => {
      //const aaa = await api.query.proposeParachain?.approvedProposals()
      //console.log(api.query)

      //const aaa = await api.query.phragmenElection.members()
      //console.log(aaa.toString())

      //const aaa = await api.query.auctions.winning(7950889)
      //console.log(aaa.toString())
      
    }

    useEffect(() => !!api.isReady && hydrateItems(), [api.isReady]) // eslint-disable-line


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