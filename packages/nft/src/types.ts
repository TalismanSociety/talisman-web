export type Nft<TType extends string, TChain extends string> = {
  id: string
  type: TType
  chain: TChain
  name: string | undefined
  description: string | undefined
  media: { url: string | undefined; mimeType?: string | undefined }
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

export type CreateNftAsyncGenerator<T extends Nft<string, string>> = {
  (address: string, options: { batchSize: number }): AsyncGenerator<T | Error>
}

export type IpfsMetadata = {
  name: string
  description: string
  image: string
}
