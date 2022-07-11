import { print } from 'graphql'

import parseTokenList from './parseTokenList'
import { graphqlUrl, tokensQuery } from './utils'

const getTokenList = async () => {
  try {
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: print(tokensQuery) }),
    })

    const { data } = await res.json()

    const tokens = parseTokenList(data?.tokens || [])

    if (Object.keys(tokens).length === 0) throw new Error('Ignoring empty chaindata tokens response')

    return tokens
  } catch (e) {
    throw new Error(e as string)
  }
}

export default getTokenList
