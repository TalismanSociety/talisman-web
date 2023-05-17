export type NFTCategory =
  | 'image'
  | 'video'
  | 'model'
  | 'application'
  | 'audio'
  | 'pdf'
  | 'loading'
  | 'blank'
  | undefined

type NFTAttributes = Record<string, any>

type NFTCollectionDetails = {
  id?: string
  name?: string
  totalCount?: number
  floorPrice?: string
}

export type NFTShort = {
  id: string
  name: string
  thumb: string | undefined
  type: NFTCategory
  metadata: string | undefined
  mediaUri: string // PDF
  provider: string
  collection: NFTCollectionDetails
  address: string
  fetchDetail: () => Promise<NFTDetail>
  nftSpecificData: any
}

export type NFTDetail = NFTShort & {
  description: string
  serialNumber?: string
  attributes: NFTAttributes
  platformUri: string
  tokenCurrency: string
}

export type EVMChain = {
  contracts: Contract
  name: string
  chainId: number
  tokenCurrency: string
  rpc: string[] // Multiple RPC's incase one doesn't work.
  platformUri: string
  other: Record<string, any>
}

export type EVMChains = Record<string, EVMChain>

export type Contract = Record<
  string,
  {
    address: string
    name: string
    symbol: string
  }
>

export type NFTData = {
  count: Record<string, number>
  isFetching: boolean
  items: NFTShort[]
}

export type NFTFactorySubscriptionCallback = (data: NFTData) => void

export type NFTDetailArray = NFTDetail[]
export type NFTShortArray = NFTShort[]
