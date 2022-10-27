import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTCategory, NFTDetail, NFTDetailArray, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

interface Token {
  metadata?: string | undefined
  owner?: string
  data?: Record<string, any>
  name?: string
  description?: string
  image?: string
}

export class AcalaProvider extends NFTInterface {
  name = 'Acala'
  uri = 'wss://acala-rpc-0.aca-api.network'
  platformUri = 'https://apps.acala.network/portfolio/nft/'
  storageProvider = ''
  detailedItems: { [key: string]: any } = {}

  webSocket: ApiPromise | null = null

  // Start the websocket
  async wsProvider() {
    const wsProvider = new WsProvider(this.uri)
    return ApiPromise.create({ provider: wsProvider })
  }

  public async fetchCollectionData(IPFSUrl: string) {
    return fetch(IPFSUrl)
      .then(res => res.json())
      .then(data => {
        return {
          name: data.name,
          description: data.description,
          image: data.image,
        }
      })
  }

  // Get token detials from the raw data (collection ID & NFT item number) provided by the websocket
  public async getTokenDetails(assetId: any): Promise<any> {
    if (!this.webSocket) return null

    const { collectionId, nftTokenId } = assetId

    const tokenDetails = await this.webSocket.query.ormlNft.tokens(collectionId, nftTokenId)
    tokenDetails.toHuman() as unknown as Token
    const collectionDetails = (await this.webSocket.query.ormlNft.classes(collectionId)).toHuman() as Record<
      string,
      any
    >

    const metadata = await this.fetchCollectionData(
      this.baseIPFSUrl + collectionDetails?.metadata + '/metadata.json'
    ).then(res => res)

    let collectionIdFixed = collectionId.replaceAll(',', '')

    // // Return the promised data for token details
    return Promise.resolve({
      id: `${collectionIdFixed}-${nftTokenId}`,
      name: metadata?.name,
      description: metadata?.description,
      mediaUri: this.toIPFSUrl(metadata?.image),
      serialNumber: nftTokenId,
      collectionId: collectionIdFixed,
    })
  }

  async fetchNFTs_Metadata(metadataId: string) {
    if (metadataId == null) return
    return fetch(this.baseIPFSUrl + metadataId)
      .then(res => res.json())
      .then(data => {
        return {
          name: data.name,
          description: data.description,
          mediaUri: this.toIPFSUrl(data.image),
          // Store Attributes / Properties as two seperate under ProtocolSpecificDetails
        }
      })
  }

  async fetchNFTs_type(IPFSUrl: string): Promise<NFTCategory> {
    let cat = 'unknown'

    if (IPFSUrl !== null) {
      cat = await fetch(IPFSUrl).then(res => {
        const headers = res.headers.get('content-type')
        return !headers ? cat : headers.split('/')[0]
      })
    }

    return cat as NFTCategory
  }

  parseShort(item: any): NFTShort {
    return {
      id: item.id,
      name: item.name,
      thumb: item.thumb,
      type: item.type,
      mediaUri: item.mediaUri,
      metadata: null,
      nftSpecificData: null,
      collection: {
        id: item.collection?.id,
        totalCount: item.collection?.totalCount,
        floorPrice: item.collection?.floorPrice,
      },
      provider: item?.provider,
      address: item?.address,
    }
  }

  async hydrateNftsByAddress(address: string) {
    this.reset()
    this.isFetching = true

    if (address.startsWith('0x')) {
      this.isFetching = false
      return
    }

    this.webSocket = await this.wsProvider()
    if (!this.webSocket) return []

    const encodedAddress = encodeAddress(address, 10)

    const nfts = await this.webSocket.query.ormlNft.tokensByOwner.keys(encodedAddress)
    this.count = nfts.length

    return this.useCache(address, this.name, nfts)
      .then((items: NFTDetailArray) => {
        // store the current set of items in this provider as a variable
        // so we can look up the details when needed
        items.forEach(item => {
          this.setItem(item)
          this.detailedItems[item.id] = item
        })
        this.isFetching = false
      })
      .catch(async store => {
        let nftRawAssetDetails: any = []
        for (let key of nfts) {
          const data = key.toHuman() as string[]
          nftRawAssetDetails.push({ collectionId: data[1], nftTokenId: data[2] })
        }

        nftRawAssetDetails.map(async (assetId: any) => {
          const tokenDetails = await this.getTokenDetails(assetId)
          if (tokenDetails) {
            const nftDetail = {
              id: tokenDetails?.id,
              name: tokenDetails?.name,
              description: tokenDetails?.description,
              mediaUri: tokenDetails?.mediaUri,
              thumb: tokenDetails?.mediaUri,
              type: null,
              metadata: null,
              serialNumber: assetId.nftTokenId,
              provider: this.name,
              platformUri: `${this.platformUri}`,
              attributes: {},
              collection: {
                id: tokenDetails.collectionId,
                totalCount: null,
                floorPrice: null,
              },
              nftSpecificData: null,
            }

            this.setItem(this.parseShort(nftDetail))
            this.detailedItems[nftDetail.id] = nftDetail

            store(Object.values(this.detailedItems))
          }
        })

        this.isFetching = false
      })
  }

  fetchOneById(id: string) {
    const internalId = id.split('.').slice(1).join('.')
    return this.items[internalId]
  }

  protected async fetchDetail(id: string): Promise<NFTDetail> {
    const item = this.detailedItems[id]
    return item
  }
}
