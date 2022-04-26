import { fetcher } from './fetcher';

function injectUrl(url: string, res: any) {
  return {
    srcUrl: url,
    ...res,
  };
}

export function multiFetcher(urls: string[]) {
  return Promise.all(
    urls.map((url) =>
      fetcher(url as string).then((res) => {
        if (Array.isArray(res)) {
          return res.map((res) => {
            return injectUrl(url, res);
          });
        }
        return injectUrl(url, res);
      })
    )
  );
}
