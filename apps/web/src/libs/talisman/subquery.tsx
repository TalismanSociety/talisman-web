import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, gql, useLazyQuery } from '@apollo/client'
import md5 from 'md5'
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { createNetworkStatusNotifier } from 'react-apollo-network-status'

import { useStatus } from './util/hooks'

const Context = createContext<any>({})

const useLoading = () => {
  const { loading } = useContext(Context)
  return loading
}

const useQuery = (query: string, _vars = {}) => {
  const [vars, setVars] = useState(_vars)

  const [trigger, { data = [], called, loading, networkStatus, refetch, error }] = useLazyQuery(
    gql`
      ${query}
    `
  )

  const { status, message, setStatus, options } = useStatus({
    status: 'PROCESSING',
    message: 'Processing query',
  })

  useEffect(() => {
    trigger({ variables: vars })
  }, [md5(JSON.stringify(vars))]) // eslint-disable-line

  useEffect(() => {
    if (!!error) {
      setStatus(options.ERROR, error)
    } else if (called === true && loading === false) {
      setStatus(options.READY)
    }
  }, [loading, error, called]) // eslint-disable-line

  return {
    data: (Object.values(data)[0] as any)?.nodes || [],
    count: Object.values(data)?.length,
    called,
    loading,
    networkStatus,
    refetch,
    setVars,
    status,
    message,
  }
}

const Provider = ({ uri = 'https://localhost:4000', children }: PropsWithChildren<{ uri: string }>) => {
  const [client, setClient] = useState<ApolloClient<any>>()
  const { useApolloNetworkStatus } = createNetworkStatusNotifier()
  const { numPendingQueries, numPendingMutations } = useApolloNetworkStatus()
  const { status, message, setStatus, options } = useStatus({
    status: 'PROCESSING',
  })

  // configure client on init / uri change
  useEffect(() => {
    try {
      const httpLink = createHttpLink({
        uri: uri,
      })

      const apolloClient = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
      })

      setClient(apolloClient)
      setStatus(options.READY)
    } catch (e: any) {
      setStatus(options.ERROR, e.message)
    }
  }, [uri]) // eslint-disable-line

  return (
    <Context.Provider
      value={{
        client,
        status,
        message,
        pendingQueryCount: numPendingQueries,
        pendingMutationCount: numPendingMutations,
        totalOutstanding: numPendingQueries + numPendingMutations,
        loading: numPendingQueries + numPendingMutations > 0,
      }}
    >
      {!!client ? <ApolloProvider client={client}>{children}</ApolloProvider> : null}
    </Context.Provider>
  )
}

const Subquery = {
  Provider,
  useLoading,
  useQuery,
  gql,
}

export default Subquery
