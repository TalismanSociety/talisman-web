import { toast } from 'react-hot-toast'

const RETRY_INTERVAL_SEC = 1

async function fetchGraphQL(text: string, variables: any, graph: 'chaindata' | 'tx-history') {
  console.log('fetch', graph)
  const url =
    graph === 'chaindata'
      ? 'https://app.gc.subsquid.io/beta/chaindata/v3/graphql'
      : 'https://squid.subsquid.io/tx-history/v/v1/graphql'
  const json = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })
    .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
    .catch(e => {
      return { errors: [{ message: JSON.stringify(e) }] }
    })
  if (json.errors) {
    const msg = `Error fetching ${graph} from Subsquid API: ${JSON.stringify(
      json.errors[0].message
    )}. Retrying in ${RETRY_INTERVAL_SEC}s...`
    toast.error(msg, { duration: RETRY_INTERVAL_SEC * 1000 })
    console.error(msg)
    return new Promise(r => {
      setTimeout(() => r(fetchGraphQL(text, variables, graph)), RETRY_INTERVAL_SEC * 1000)
    })
  }
  console.log('return', graph)
  return json
}

export default fetchGraphQL
