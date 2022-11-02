export type NFTCategory = 'image' | 'video' | 'model' | 'application' | 'audio' | 'pdf' | 'loading' | 'blank' | null

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
  metadata: string | null
  mediaUri: string // PDF
  provider: string
  collection: NFTCollectionDetails | {}
  address: string
  fetchDetail?: () => Promise<NFTDetail>
  nftSpecificData: any
}

export type NFTDetail = NFTShort & {
  description: string
  serialNumber?: string
  attributes: NFTAttributes
  platformUri: string
}

export type EVMChain = {
  contracts: Contract
  name: string
  rpc: string[] // Multiple RPC's incase one doesn't work.
  other: {
    [key: string]: any
  }
}

export type EVMChains = {
  [key: string]: EVMChain
}

export type Contract = {
  [key: string]: {
    address: string
    name: string
    symbol: string
    totalSupply: number
  }
}

export type NFTData = {
  count: number
  isFetching: boolean
  items: NFTShort[]
}

//export type NFTShortObject = {[key: string]: NFTShort[]}

export type NFTFactorySubscriptionCallback = (data: NFTData) => void

export type NFTDetailArray = NFTDetail[]
export type NFTShortArray = NFTShort[]
