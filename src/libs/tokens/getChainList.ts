import { print } from 'graphql'

import addCustomChainRpcs from './addCustomChainRpcs'
import parseChainList from './parseChainList'
import { chaindataQuery, graphqlUrl } from './utils'

const getChainList = async () => {
  try {
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: print(chaindataQuery) }),
    })

    const { data } = await res.json()

    const chainList = parseChainList(addCustomChainRpcs(data?.chains || []))

    if (Object.keys(chainList).length <= 0) throw new Error('Ignoring empty chaindata chains response')

    return chainList
  } catch (e) {
    throw new Error(e as string)
  }
}

export default getChainList
