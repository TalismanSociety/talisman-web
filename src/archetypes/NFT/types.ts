import { ReactElement } from 'react'

export interface NftData {
  nft: any // TODO: Get proper type for this.
}

export interface NftElement extends NftData {
  LoaderComponent?: ReactElement
  FallbackComponent?: ReactElement
  ErrorComponent?: ReactElement
}