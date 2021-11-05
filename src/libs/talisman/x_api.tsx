import { 
  createContext, 
  useContext,
  useState,
  useEffect
} from 'react'
import { 
  useStatus, 
} from './util/hooks'
import { useSettings } from '@libs/talisman'
import { ApiPromise, WsProvider } from '@polkadot/api';

const Context = createContext({});

const useApi = () => useContext(Context)

const Provider = 
  ({
    children
  }) => {

    const [api, setApi] = useState()
    const { 
      status,
      message,
      setStatus,
      options
    } = useStatus()

    const { chain } = useSettings()

    const connect = async rpc => {
      // eject if rpc not provided
      if(!rpc) return
      
      setStatus('PROCESSING')
    	const wsProvider = new WsProvider(rpc);
			ApiPromise
			  .create({ provider: wsProvider })
			  .then(api => {
          setApi(api)
          setStatus('READY')
        })
        .catch(error => setStatus('ERROR', error.message))
    }

    // connect on rcp
    useEffect(() => chain?.rpc && connect(chain?.rpc), [chain?.rpc])  // eslint-disable-line

    // todo / out loud thinking / maybe-maybenot
    // if api is not connected or ready, we need to store queries/callbacks until it is.
    // probably best if we provide something like useQuery('system.account', callback)
    // or maybe just wrap the required query object?
    // currently have some backwards checks in other places to make sure api is
    // ready before querying, but would rather remove those dependencies
    // ie other functions should not care if the api is ready or not, just fire
    // the query and await the response
    
    return <Context.Provider 
      value={{
        query: api?.query,
        rpc: api?.rpc,
        isReady: status === options.READY,
        status,
        message,
      }}
      >
      {children}
    </Context.Provider>
  }

const Api = {
  Provider,
  useApi
}

export default Api