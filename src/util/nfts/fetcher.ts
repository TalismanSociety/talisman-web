export function fetcher(url: string) {
  return fetch(url).then((res) => {
    return res.json();
  });
}
