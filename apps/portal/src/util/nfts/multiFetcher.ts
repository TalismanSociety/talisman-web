import { fetcher } from './fetcher'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function injectUrl(url: string, res: any) {
  return {
    srcUrl: url,
    ...res,
  }
}

export async function multiFetcher(urls: string[]) {
  return await Promise.all(
    urls.map(
      async url =>
        await fetcher(url).then(res => {
          if (Array.isArray(res)) {
            return res.map(res => {
              return injectUrl(url, res)
            })
          }
          return injectUrl(url, res)
        })
    )
  )
}
