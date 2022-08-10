import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTDetail, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

const QUERY_SHORT = gql`
  query ($address: String!) {
    nfts(where: { owner: { _eq: $address } }) {
      id
      metadata_name
      resources {
        metadata_content_type
        src
      }
      collection {
        id
        metadata_name
        max
      }
      metadata_image
    }
  }
`

const QUERY_DETAIL = gql`
  query ($id: String!) {
    nfts(where: { id: { _eq: $id } }) {
      id
      symbol
      metadata
      metadata_name
      metadata_description
      resources {
        metadata_content_type
        thumb
        src
      }
      metadata_image
      sn
      metadata_properties
      collection {
        id
        metadata_name
        max
      }
    }
  }
`

export class Rmrk2Provider extends NFTInterface {
  name = 'RMRK2'
  uri = 'https://gql-rmrk2-prod.graphcdn.app'
  platformUri = 'https://singular.app/collectibles/'
  indexUri = 'https://singular.app/api/rmrk2/account/'
  collectionUri = 'https://singular.app/api/stats/collection/'
  storageProvider = ''
  client: any

  async getClient() {
    if (this.client) return this.client

    this.client = await new ApolloClient({
      link: createHttpLink({ uri: this.uri }),
      cache: new InMemoryCache(),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })

    return this.client
  }

  async fetchAllByAddress(address: string) {
    if (address.startsWith('0x')) return []

    const encodedAddress = encodeAddress(address, 2)

    const client = await this.getClient()

    this.indexedNFTs = await fetch(`${this.indexUri}${encodedAddress}`)
      .then((res: any) => res.json())
      .then((res: any) => {
        return Promise.all(
          res?.map(async (nft: any) => {
            return {
              id: nft?.id,
              name: nft?.metadata_name || nft?.symbol,
              isComposable: nft?.isComposable,
              metadata: this.toIPFSUrl(nft?.metadata),
              symbol: nft?.symbol,
              serialNumber: nft?.sn.replace(/^0+/, ''),
              mediaUri: this.toIPFSUrl(nft?.image), // Up here
              thumb: this.toIPFSUrl(nft?.primaryResource?.thumb),
            } as any
          })
        )
      })

    const data = await client.query({ query: QUERY_SHORT, variables: { address: encodedAddress } }).then((res: any) => {
      return Promise.all(
        res?.data?.nfts.map(async (nft: any) => {
          const indexedItemRef = this.indexedNFTs.find((item: any) => item.id === nft?.id)

          const mediaUri = !!indexedItemRef?.mediaUri
            ? indexedItemRef?.mediaUri
            : !!nft?.resources[0]?.src
            ? this.toIPFSUrl(nft?.resources[0]?.src)
            : !!nft?.metadata_image
            ? this.toIPFSUrl(nft?.metadata_image)
            : await this.fetchMediaFromMetadata(indexedItemRef?.metadata)

          const thumb = indexedItemRef?.thumb || this.toIPFSUrl(nft?.resources[0]?.thumb) || null
          const type = nft?.resources[0]?.metadata_content_type

          return {
            id: indexedItemRef.id,
            name: nft?.metadata_name || indexedItemRef?.symbol,
            thumb,
            type,
            mediaUri,
            metadata: indexedItemRef?.metadata,
            collection: {
              id: nft?.collection?.id,
              name: nft?.collection?.metadata_name,
              totalCount: nft?.collection?.max,
            },
            platform: this.name,
          } as NFTShort
        })
      )
    })

    // data smooshing here before returning
    return data
  }

  async fetchOneById(id: string) {
    const client = await this.getClient()

    return client
      .query({ query: QUERY_DETAIL, variables: { id: id } })
      .then(async (res: any) => {
        const nft = res?.data?.nfts[0]

        if (!nft) throw new Error('TBD')

        const indexedItemRef = this.indexedNFTs.find((item: any) => item.id === nft?.id)

        // parse out the thumb image
        const mediaUri = !!nft?.resources[0]?.src
          ? this.toIPFSUrl(nft?.resources[0]?.src)
          : !!indexedItemRef?.mediaUri
          ? indexedItemRef?.mediaUri
          : !!nft?.metadata_image
          ? this.toIPFSUrl(nft?.metadata_image)
          : await this.fetchMediaFromMetadata(indexedItemRef?.metadata)

        const type = nft?.resources[0]?.metadata_content_type ?? (await this.fetchContentType(mediaUri))
        const thumb = !!indexedItemRef.thumb
          ? indexedItemRef.thumb
          : !!nft?.resources[0]?.thumb
          ? this.toIPFSUrl(nft?.resources[0]?.thumb)
          : null
        const collectionInfo = await this.fetchNFTs_CollectionInfo(nft?.collection?.id, this.collectionUri)
        // get the context type of null

        const item = {
          id: nft?.id,
          name: nft?.metadata_name || indexedItemRef?.symbol,
          thumb,
          description: nft?.metadata_description,
          serialNumber: nft?.sn.replace(/^0+/, ''),
          metadata: indexedItemRef?.metadata || nft?.metadata,
          type,
          mediaUri,
          platform: this.name,
          platformUri: this.platformUri + nft?.id,
          attributes: nft?.metadata_properties || [],
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.metadata_name,
            totalCount: collectionInfo?.totalNfts,
            floorPrice: collectionInfo?.floor,
          },
          nftSpecificData: {
            isComposable: indexedItemRef?.isComposable,
          },
        } as NFTDetail

        return item
      })
      .catch((e: any) => {})
  }
}
