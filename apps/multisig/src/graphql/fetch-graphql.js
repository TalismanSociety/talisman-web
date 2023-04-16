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

  return await response.json()
}

export default fetchGraphQL
