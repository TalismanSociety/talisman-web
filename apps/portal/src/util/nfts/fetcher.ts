export async function fetcher(url: string) {
  return await fetch(url).then(async res => {
    return await res.json()
  })
}
