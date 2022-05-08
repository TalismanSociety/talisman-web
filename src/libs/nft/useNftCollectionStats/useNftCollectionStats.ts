import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNftCollectionStats(nftId: string, rmrk2: boolean) {
  const fetchURL = rmrk2
    ? `https://singular.app/api/stats/collection`
    : `https://singular.rmrk.app/api/stats/collection`

  const { data, error } = useSWR(fetchURL + '/' + nftId, fetcher)

  let floor = data ? (parseFloat(data.floor) / 1000000000000).toFixed(3) : '...'

  return {
    floor,
    totalNFTs: data ? data.totalNFTs : '...',
  }
}
