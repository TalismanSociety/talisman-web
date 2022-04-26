export function contentTypeFetcher(url: string) {
  return fetch(url).then((res) => {
    return res.headers.get('content-type');
  });
}
