import useSWR from 'swr'

import { multiFetcher } from '../../../util/nfts/multiFetcher'
import { RMRK1Fetcher } from '../fetchers/RMRK1Fetcher'
import { RMRK2Fetcher } from '../fetchers/RMRK2Fetcher'

const RMRK1 = new RMRK1Fetcher()
const RMRK2 = new RMRK2Fetcher()

export function useNftsByAddress(address: string) {
  const urls = [RMRK1.fetchUrl({ address }), RMRK2.fetchUrl({ address })].filter(Boolean)
  const cacheKey = urls?.length > 0 ? [RMRK2.baseFetchUrl, urls] : null
  const { data, error } = useSWR(cacheKey, () => multiFetcher(urls as string[]))
  return {
    nfts: data?.flat(),
    isLoading: urls.length > 0 && !error && !data,
    error,
  }
}

export default useNftsByAddress
