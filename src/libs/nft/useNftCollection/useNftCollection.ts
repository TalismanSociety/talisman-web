import useSWR from 'swr'

import { fetcher } from '../../../util/nfts/fetcher'

export function useNftCollection(url: string) {
  const { data, error } = useSWR(url, fetcher)
  return {
    nftCollectionMetadata: data,
    isLoading: url && !error && !data,
    error,
  }
}

export default useNftCollection
