import { ReactElement } from 'react'

export interface NftElement extends NftData {
  LoaderComponent?: ReactElement
  FallbackComponent?: ReactElement
  ErrorComponent?: ReactElement
}
