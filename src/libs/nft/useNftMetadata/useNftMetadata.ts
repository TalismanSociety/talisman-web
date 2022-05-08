import useSWR from 'swr'

import { fetcher } from '../../../util/nfts/fetcher'

export function useNftMetadata(url: string) {
  const { data, error } = useSWR(url, fetcher)
  return {
    nftMetadata: data,
    isLoading: url && !error && !data,
    error,
  }
}

export default useNftMetadata
