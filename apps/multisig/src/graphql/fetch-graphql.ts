const RETRY_INTERVAL_SEC = 10

async function fetchGraphQL(text: string, variables: any, graph: 'chaindata' | 'tx-history') {
  const url =
    graph === 'chaindata'
      ? 'https://squid.subsquid.io/chaindata/v/v4/graphql'
      : 'https://squid.subsquid.io/sigsquid/graphql'
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
    console.error(msg)
    return new Promise(r => {
      setTimeout(() => r(fetchGraphQL(text, variables, graph)), RETRY_INTERVAL_SEC * 1000)
    })
  }
  return json
}

export default fetchGraphQL
