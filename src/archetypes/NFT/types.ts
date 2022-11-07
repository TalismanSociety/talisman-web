import { ReactElement } from 'react'

export interface NftElement extends NftData {
  LoaderComponent?: ReactElement
  FallbackComponent?: ReactElement
  ErrorComponent?: ReactElement
}

export type NFTChild = {
  id: string
  name: string
  mediaUri: string
  serialNumber: string
}
