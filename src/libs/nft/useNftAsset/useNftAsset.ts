import { RMRK1Fetcher } from '../fetchers/RMRK1Fetcher'
import { RMRK2Fetcher } from '../fetchers/RMRK2Fetcher'
import useContentType from '../useContentType/useContentType'
import useNftMetadata from '../useNftMetadata/useNftMetadata'

const RMRK1 = new RMRK1Fetcher()
const RMRK2 = new RMRK2Fetcher()

function getNftCollectibleUrl(nft: any) {
  const url = RMRK1.collectibleUrl(nft?.id, nft?.srcUrl) || RMRK2.collectibleUrl(nft?.id, nft?.srcUrl)
  return url
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNftAsset(nft: any) {
  const metadataUrl = nft?.metadata
  const prefetchedContentType = nft?.metadata_content_type
  const image = nft?.metadata_image
  // If any of `metadata_content_type` or `metadata_image` is missing,
  // fallback to calling the `metadata` url to get image or `animation_url`.
  // Otherwise, no need to do an extra call. Video content_type needs the extra metadata call.
  const shouldGetMetadata = true
  const url = RMRK1.toWeb2Url(shouldGetMetadata ? metadataUrl : null)
  const { nftMetadata, ...restMetadata } = useNftMetadata(url)
  const name = nft?.name || nft?.metadata_name || nftMetadata?.name
  const animationUrl = RMRK1.toWeb2Url(nftMetadata?.animation_url)
  // For instances where `nft?.image` is not present, take the image from `metadata`.
  const imageUrl = RMRK1.toWeb2Url(
    image || nft?.image || nftMetadata?.image || nftMetadata?.mediaUri || nftMetadata?.thumbnailUri
  )

  const {
    contentType: contentTypeFromMetadata,
    contentCategory: contentCategoryFromMetadata,
    contentExtension: contentExtensionFromMetadata,
  } = useContentType(RMRK1.toWeb2Url(nftMetadata?.mediaUri))
  const [prefetchedContentCategory, prefetchedContentExtension] = prefetchedContentType?.split('/') || []
  const description = nftMetadata?.description || 'No Description'
  const contentType = prefetchedContentType || contentTypeFromMetadata
  const contentCategory = prefetchedContentCategory || contentCategoryFromMetadata
  const contentExtension = prefetchedContentExtension || contentExtensionFromMetadata
  const previewAnimationUrl = ['video', 'model'].includes(contentCategory) && (animationUrl || imageUrl)
  const previewImageUrl = animationUrl || imageUrl
  const previewSrc = previewAnimationUrl || previewImageUrl
  const properties = nftMetadata?.properties || {}
  const collectibleUrl = getNftCollectibleUrl(nft)
  const id = nft?.id

  // Fetching the Collelction

  const collection = {
    // TODO: Should not be description but need something as placeholder for collection name if it does not exist.
    name: nft?.collection?.name || nftMetadata?.name,
  }

  return {
    previewSrc,
    name,
    id,
    description,
    imageUrl,
    properties,
    animationUrl,
    contentCategory,
    contentExtension,
    contentType,
    collection,
    collectibleUrl,
    ...restMetadata,
  }
}

export default useNftAsset
