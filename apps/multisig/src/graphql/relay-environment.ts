import { EnvironmentKey } from 'recoil-relay'
import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import fetchGraphQL from './fetch-graphql'

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
async function fetchRelay(params: any, variables: any) {
  return fetchGraphQL(params.text, variables, 'chaindata')
}

// Export a singleton instance of Relay Environment configured with our network function:
const RelayEnvironment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
})

export const chainDataSquidEnvKey = new EnvironmentKey('chaindata-squid')

export default RelayEnvironment
