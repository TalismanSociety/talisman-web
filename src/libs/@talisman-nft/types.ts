export type NFTCategory = 'image' | 'video' | 'model' | 'application' | 'audio' | 'pdf' | 'loading' | null

type NFTAttributes = Record<string, any>

type NFTCollectionDetails = {
  id?: string
  name?: string
  totalCount?: number
  floorPrice?: string
}

export type NFTShort = {
  id: string
  name: string | null
  thumb: string | null
  type: NFTCategory
  mediaUri: string // PDF
  platform: string
}

export type NFTDetail = NFTShort & {
  description: string
  serialNumber?: string
  attributes: NFTAttributes
  collection: NFTCollectionDetails | {}
  nftSpecificData: any
  platformUri: string
}

export type NFTDetailArray = NFTDetail[]
export type NFTShortArray = NFTShort[]
