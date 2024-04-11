import { fetcher } from './fetcher'

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
