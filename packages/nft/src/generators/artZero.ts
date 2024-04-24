import { encodeAddress } from '@polkadot/util-crypto'

import type { CreateNftAsyncGenerator, Nft } from '../types.js'

const ARTZERO_URL = 'https://a0.artzero.io'
const ARTZERO_API = 'https://a0-api.artzero.io'

const type = 'artzero' as const
const chain = 'aleph-zero' as const
type ThisNft = Nft<typeof type, typeof chain>

type PartialNullable<T> = { [K in keyof T]: T[K] | undefined | null }

type ArtzeroGetNFTsByOwnerResult =
  | PartialNullable<{ status: string; ret: Array<ArtzeroGetNFTsByOwnerResultItem> }>
  | null
  | undefined

type ArtzeroGetNFTsByOwnerResultItem = PartialNullable<{
  /** e.g. '66272e7ce3a6059a6f72a8a2', '6426f5bd33ad7f2e51babbdf' */
  _id: string
  /** e.g. 'fontbois', 'Azero Punk #1' */
  nftName: string
  /** e.g. "fontbois.azero, a domain on Aleph Zero's issued by AZERO.ID.", 'Azero Punk #1 of 5555' */
  description: string
  /** e.g. 'https://azero.id/api/v1/image/fontbois.azero.png', 'ipfs://QmT57pA1rX9PgN93W1jeqmGR4MQnoprF8oco8MdTC77qwH/1.png' */
  avatar: string
  /** e.g. '5CTQBfBC9SfdrCDBJdfLiyW2pg9z5W6C6Es8sK313BLnFgDf', '5E7HFbvv7o4zFpJxnUsJF5CNktew1T6nh3gctbkSTWGAeiMT' */
  nftContractAddress: string
  /** e.g. '5CcU6DRpocLUWYJHuNLjB4gGyHJrkWuruQD5XFbRYffCfSAP', '5GBTaiUQGnS86qN5xj5xeaHrtR4NURmSi92SpLD7KTtqkVTn' */
  owner: string
  /** e.g. null, 1, 2549 */
  tokenID: number
  /** e.g. 'fontbois', null */
  azDomainName: string
  /** e.g. 'Transfer', null */
  azEventName: string
  /** e.g. true, null */
  isAzDomain: boolean
  /** e.g. '1745379826001', null */
  expiration_timestamp: string
  /** e.g. '1713843826001', null */
  registration_timestamp: string
  /** e.g. ['registration_timestamp', 'expiration_timestamp'], [] */
  attributes: string[]
  /** e.g. ['1713843826001', '1745379826001'], [] */
  attributesValue: string[]
  /** e.g. 0 */
  listed_date: number
  /** e.g. 0 */
  price: number
  /** e.g. false */
  is_for_sale: boolean
  /** e.g. '' */
  nft_owner: string
  /** e.g. null */
  highest_bid: unknown
  /** e.g. false */
  is_locked: boolean
  /** e.g. { 'Registration Time': '1713843826001', 'Expiration Time': '1745379826001' }, { Background: 'Happy Dev Blue', Character: 'Adam Gagol' } */
  traits: Record<string, string | undefined>
  /** e.g. null */
  hash: unknown
  /** e.g. null */
  flag: unknown
  /** e.g. null */
  dataObject: unknown
  /** e.g. '2024-04-23T03:43:56.671Z' */
  createdTime: string
  /** e.g. '2024-04-23T03:44:08.273Z' */
  updatedTime: string
}>

export const createArtZeroNftAsyncGenerator: CreateNftAsyncGenerator<ThisNft> = async function* (
  address,
  { batchSize }
) {
  let offset = 0

  while (true) {
    const owner = encodeAddress(address, 42)
    const limit = batchSize
    const sort = -1
    const isActive = true

    const response = await fetch(`${ARTZERO_API}/getNFTsByOwner`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(
        Object.entries({ owner, limit, offset, sort, isActive }).map(([key, value]) => [key, value.toString()])
      ).toString(),
    })
    if (!response.ok) throw new Error(`ArtZero api response not ok: ${response.status}`, { cause: response })

    const result: ArtzeroGetNFTsByOwnerResult = await response.json()
    if (!Array.isArray(result?.ret)) break
    if ((result?.ret?.length ?? 0) < 1) break

    yield* (result?.ret ?? []).map(parseNft)

    offset += batchSize
  }
}

const parseNft = (nft: ArtzeroGetNFTsByOwnerResultItem): ThisNft | Error => {
  if (typeof nft._id !== 'string') return new Error(`NFT is missing required field '_id'`, { cause: nft })

  return {
    type,
    chain,
    id: `${type}-${chain}-${nft._id}`,
    name: nft.nftName ?? undefined,
    description: nft.description ?? undefined,
    media: { url: nft.avatar ?? undefined },
    thumbnail: nft.avatar ?? undefined,
    serialNumber: nft.tokenID ?? undefined,
    properties: Object.fromEntries(
      Object.entries(nft.traits ?? {}).flatMap(([key, value]) => (typeof value === 'string' ? [[key, value]] : []))
    ),
    externalLinks: [
      {
        name: 'ArtZero',
        url: (() => {
          if (nft.isAzDomain) return `${ARTZERO_URL}/nft/${nft.nftContractAddress}/${nft.nftName}`
          if (typeof nft.tokenID === 'number') return `${ARTZERO_URL}/nft/${nft.nftContractAddress}/${nft.tokenID}`
          return `${ARTZERO_URL}/collection/${nft.nftContractAddress}`
        })(),
      },
    ],
    collection:
      typeof nft.nftContractAddress === 'string'
        ? {
            id: nft.nftContractAddress,
            name: nft.isAzDomain ? 'AZERO.ID Domains' : undefined,
            totalSupply: undefined,
          }
        : undefined,
  }
}
