type BaseNft = {
  id: string
  name: string | undefined
  description: string | undefined
  media: string | undefined
  thumbnail: string | undefined
  serialNumber: number | undefined
  properties: Record<string, unknown> | undefined
  externalLinks: Array<{ name: string; url: string }> | undefined
  collection:
    | {
        id: string
        name: string | undefined
        totalSupply: number | undefined
      }
    | undefined
}

export type SubstrateNft = BaseNft & {
  type: 'substrate'
  chain: 'statemint' | 'statemine'
}

export type AcalaNft = BaseNft & {
  type: 'acala'
}

export type Rmrk1Nft = BaseNft & {
  type: 'rmrk1'
}

export type Rmrk2Nft = BaseNft & {
  type: 'rmrk2'
  children?: Rmrk2Nft[]
}

export type UniqueNetworkNft = BaseNft & {
  type: 'unique-network'
}

export type EvmNft = BaseNft & {
  type: 'evm'
  chain: string
}

export type Nft = SubstrateNft | AcalaNft | Rmrk1Nft | Rmrk2Nft | EvmNft | UniqueNetworkNft

export type CreateNftAsyncGenerator<T extends BaseNft = BaseNft> = {
  (address: string, options: { batchSize: number }): AsyncGenerator<T>
}

export type IpfsMetadata = {
  name: string
  description: string
  image: string
}
