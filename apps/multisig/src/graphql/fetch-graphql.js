import { toast } from 'react-hot-toast'

const RETRY_INTERVAL_SEC = 5

async function fetchGraphQL(text, variables) {
  const response = await fetch('https://app.gc.subsquid.io/beta/chaindata/v3/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  })

  const json = await response.json()
  if (json.errors) {
    const msg = `Error fetching data from Subsquid API: ${JSON.stringify(
      json.errors[0].message
    )}. Retrying in ${RETRY_INTERVAL_SEC}s...`
    toast.error(msg, { duration: RETRY_INTERVAL_SEC * 1000 })
    console.error(msg)
    return new Promise(r => {
      setTimeout(() => r(fetchGraphQL(text, variables)), RETRY_INTERVAL_SEC * 1000)
    })
  }
  return json
}

export default fetchGraphQL
