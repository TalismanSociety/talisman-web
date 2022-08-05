import useSWR from 'swr'

import { contentTypeFetcher } from '../../../util/nfts/contentTypeFetcher'

export function useContentType(url: string) {
  const { data, error } = useSWR(url, contentTypeFetcher)
  const [contentCategory, contentExtension] = data?.split('/') || []
  return {
    contentType: data,
    contentCategory,
    contentExtension,
    error,
    isLoading: !data && !error,
  }
}

export default useContentType
