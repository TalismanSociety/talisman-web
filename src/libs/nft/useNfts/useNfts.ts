import useSWR from 'swr'

import { multiFetcher } from '../../../util/nfts/multiFetcher'
import { RMRK1Fetcher } from '../fetchers/RMRK1Fetcher'
import { RMRK2Fetcher } from '../fetchers/RMRK2Fetcher'

const RMRK1 = new RMRK1Fetcher()
const RMRK2 = new RMRK2Fetcher()

export interface UseNftsOptions {
  limit?: number
  limitPerAddress?: number
}

export function useNfts(addresses: string[], options?: UseNftsOptions) {
  const urls = (addresses || [])
    .flatMap(address => [RMRK1.fetchUrl({ address }), RMRK2.fetchUrl({ address })])
    .filter(Boolean)
  const cacheKey = addresses?.length > 0 ? [RMRK2.baseFetchUrl, urls] : null
  const { data, error } = useSWR(cacheKey, () => multiFetcher(urls as string[]))
  const nftsWithSrc = (data || []).map(nftsByAddress => {
    return (Array.isArray(nftsByAddress) ? nftsByAddress : []).map((nft: any) => {
      return {
        srcUrl: nftsByAddress.srcUrl,
        ...nft,
      }
    })
  })
  const limitNfts = options?.limit ? (nftsWithSrc || []).flat().slice(0, options?.limit) : null
  const limitNftsPerAddress = options?.limitPerAddress
    ? (nftsWithSrc || []).flatMap(flatData => (flatData || []).slice(0, options?.limitPerAddress))
    : null
  return {
    nfts: limitNfts || limitNftsPerAddress || (nftsWithSrc || []).flat(),
    isLoading: urls && !error && !nftsWithSrc,
    error,
  }
}

export default useNfts
