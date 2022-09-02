import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useNftCollectionStats(nft: any) {
  const collectionId = nft?.collectionId
  const isRMRK2 = nft?.primaryResource ? true : false

  const fetchURL = isRMRK2
    ? `https://singular.app/api/stats/collection`
    : `https://singular.rmrk.app/api/stats/collection`

  const { data, error } = useSWR(fetchURL + '/' + collectionId, fetcher)

  let floor = data ? (parseFloat(data.floor) / 1000000000000).toFixed(3) : '...'

  let collectionData = {
    floor,
    totalNFTs: data ? data.totalNFTs : '...',
    error,
  }

  return {
    isLoading: nft && !error && data,
    collectionData,
  }
}
