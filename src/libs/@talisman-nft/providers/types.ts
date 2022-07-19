export type NFTCategory = "image" | "video" | "model" | "application" | "audio" | "unknown"

type NFTAttributes = Record<string, any> | null

type NFTCollectionDetails = {
  id?: string
  name?: string
  totalCount?: number
  floorPrice?: string
}

export type NFTItem = {
  id: string;
  name: string | null;
  description: string;
  thumb: string | null;
  type: NFTCategory;
  mediaUri: string;
  serialNumber?: string;
  platform: string;
  attributes: NFTAttributes
  collection: NFTCollectionDetails | {}
  nftSpecificData: any
} 

export type NFTItemArray = [NFTItem?]
