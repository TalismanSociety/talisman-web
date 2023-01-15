onmessage = event => {
  if (event.data.type === 'triggerCallback') {
    const providers = event.data.providers

    // init array
    let count = {}
    let fetchingArray = []
    let items = {}

    // iterate through the providers and parse info
    providers.forEach(provider => {
      Object.keys(provider.count).forEach(address => {
        if (count[address]) {
          count[address] += provider.count[address] ?? 0
        } else {
          count[address] = provider.count[address] ?? 0
        }
      })

      fetchingArray.push(provider.isFetching)
      items = { ...items, ...provider.items }
    })

    // post the result back to the main thread
    postMessage({
      count,
      isFetching: !!fetchingArray.includes(true),
      items: Object.values(items),
    })
  }
}
