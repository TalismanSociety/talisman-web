export async function contentTypeFetcher(url: string) {
  return await fetch(url).then(res => {
    return res.headers.get('content-type')
  })
}
