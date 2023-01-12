import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTDetail, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

const QUERY_SHORT = gql`
  query ($address: String!) {
    nfts(where: { owner: { _eq: $address }, burned: { _eq: "" } }) {
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
      children {
        id
        metadata_name
        metadata_image
        sn
      }
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
  indexUri = 'https://singular.rmrk-api.xyz/api/account/'
  collectionUri = 'https://singular.app/api/stats/collection/'
  storageProvider = ''
  client: any
  tokenCurrency = 'KSM'

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

  async hydrateNftsByAddress(address: string) {
    this.reset()
    this.isFetching = true

    if (address.startsWith('0x')) {
      this.isFetching = false
      return
    }

    const client = await this.getClient()
    const encodedAddress = encodeAddress(address, 2)

    // returns the bare minimum items to get the count
    const itemIndex = await fetch(`${this.indexUri}${encodedAddress}`).then((res: any) => res.json())

    // Set this coutn based on length
    this.count = itemIndex.length

    const idItemMap: { [key: string]: any } = {}
    itemIndex.forEach(
      (item: any) =>
        (idItemMap[item.id] = {
          id: item.id,
          name: item?.metadata_name,
          isComposable: item?.isComposable,
          metadata: this.toIPFSUrl(item?.metadata),
          symbol: item?.symbol,
          serialNumber: item?.sn.replace(/^0+/, ''),
          mediaUri: this.toIPFSUrl(item?.image), // Up here
          thumb: this.toIPFSUrl(item?.primaryResource?.thumb),
        })
    )

    await client.query({ query: QUERY_SHORT, variables: { address: encodedAddress } }).then(({ data }: any) => {
      data.nfts.forEach(async (nft: any) => {
        const indexedItemRef = idItemMap[nft.id]

        const mediaUri = !!indexedItemRef?.mediaUri
          ? indexedItemRef?.mediaUri
          : !!nft?.resources[0]?.src
          ? this.toIPFSUrl(nft?.resources[0]?.src)
          : !!nft?.metadata_image
          ? this.toIPFSUrl(nft?.metadata_image)
          : await this.fetchMediaFromMetadata(indexedItemRef?.metadata)

        const thumb = indexedItemRef?.thumb || this.toIPFSUrl(nft?.resources[0]?.thumb) || null
        const type = nft?.resources[0]?.metadata_content_type

        const item = {
          id: indexedItemRef?.id || nft?.id,
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
          nftSpecificData: {
            isComposable: indexedItemRef?.isComposable,
          },
          address,
          provider: this.name,
        } as NFTShort

        this.setItem(item)
      })

      Object.values(idItemMap).forEach(async (item: any) => {
        // check if item id is in the this.items array
        if (!data.nfts.find((i: any) => i.id === item.id)) {
          const metadata = await fetch(item.metadata).then((res: any) => res.json())

          const nft = {
            id: item.id,
            name: item?.name || metadata?.name,
            thumb: item?.thumb,
            type: item?.type,
            mediaUri: item.mediaUri,
            metadata: item.metadata,
            collection: {
              id: metadata?.collection?.id,
            },
            address,
            provider: this.name,
          } as NFTShort

          this.setItem(nft)
        }
      })
    })

    this.isFetching = false
  }

  fetchOneById(id: string) {
    const internalId = id.split('.').slice(1).join('.')
    return this.items[internalId]
  }

  protected async fetchDetail(id: string): Promise<NFTDetail> {
    const client = await this.getClient()

    return await client
      .query({ query: QUERY_DETAIL, variables: { id } })
      .then(async (res: any) => {
        const nft = res?.data?.nfts[0]

        if (!nft) throw new Error('TBD')

        const indexedItemRef = this.items[nft?.id]

        // parse out the thumb image
        const mediaUri = !!nft?.resources[0]?.src
          ? this.toIPFSUrl(nft?.resources[0]?.src)
          : !!indexedItemRef?.mediaUri
          ? indexedItemRef?.mediaUri
          : !!nft?.metadata_image
          ? this.toIPFSUrl(nft?.metadata_image)
          : await this.fetchMediaFromMetadata(indexedItemRef?.metadata)

        const type = nft?.resources[0]?.metadata_content_type ?? (await this.fetchContentType(mediaUri))
        const thumb = !!indexedItemRef?.thumb
          ? indexedItemRef.thumb
          : !!nft?.resources[0]?.thumb
          ? this.toIPFSUrl(nft?.resources[0]?.thumb)
          : null
        const collectionInfo = await this.fetchNFTs_CollectionInfo(nft?.collection?.id, this.collectionUri)

        const children = nft?.children?.map((child: any) => ({
          id: child?.id,
          name: child?.metadata_name,
          mediaUri: this.items[child?.id]?.mediaUri ?? this.toIPFSUrl(child?.metadata_image),
          serialNumber: child?.sn.replace(/^0+/, ''),
        }))

        return {
          id: nft?.id,
          name: nft?.metadata_name || nft?.symbol,
          thumb,
          description: nft?.metadata_description,
          serialNumber: nft?.sn.replace(/^0+/, ''),
          metadata: indexedItemRef?.metadata || nft?.metadata,
          type,
          mediaUri,
          provider: this.name,
          platformUri: this.platformUri + nft?.id,
          attributes: nft?.metadata_properties || [],
          collection: {
            id: nft?.collection?.id,
            name: nft?.collection?.metadata_name,
            totalCount: collectionInfo?.totalNfts,
            floorPrice: collectionInfo?.floor,
          },
          nftSpecificData: {
            isComposable: indexedItemRef?.nftSpecificData?.isComposable,
            children,
          },
          tokenCurrency: this.tokenCurrency,
        } as NFTDetail
      })
      .catch((e: any) => {})
  }
}
