import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTCategory, NFTDetail, NFTDetailArray, NFTShortArray } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class StatemineProvider extends NFTInterface {
  name = 'StateMine'
  uri = 'wss://statemine.api.onfinality.io/public-ws'
  platformUri = 'https://singular.app/collectibles/statemine/'
  storageProvider = ''
  items: NFTDetailArray = []

  webSocket: ApiPromise | null = null

  // Start the websocket
  async wsProvider() {
    const wsProvider = new WsProvider(this.uri)
    return ApiPromise.create({ provider: wsProvider })
  }

  // Get token detials from the raw data (collection ID & NFT item number) provided by the websocket
  public async getTokenDetails(assetId: any): Promise<any> {
    if (!this.webSocket) return null

    const { collectionId, nftTokenId } = assetId
    // For some reason, there are commas in the collection ID, removed them.
    let collectionIdFixed = collectionId.replaceAll(',', '')
    // Need to check how common this is with other collection IDs within Statemine.
    const metadataNft = (
      await this.webSocket.query.uniques.instanceMetadataOf(collectionIdFixed, nftTokenId)
    ).toHuman() as any
    // Get the NFT IPFS Hash from the uniques query
    if (!metadataNft?.data) return null
    // Get the NFT name, description and Media URI from the metadata using the base IPFS url.
    const metadata = await this.fetchNFTs_Metadata(metadataNft.data)

    // Return the promised data for token details
    return Promise.resolve({
      id: `${collectionIdFixed}-${nftTokenId}`,
      name: metadata?.name,
      description: metadata?.description,
      mediaUri: metadata?.mediaUri,
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

  parseShorts(items: NFTDetailArray): NFTShortArray {
    return items.map((item: NFTDetail) => {
      return {
        id: item.id,
        name: item.name,
        thumb: item.thumb,
        type: item.type,
        mediaUri: item.mediaUri,
        collection: {
          id: item.collection?.id,
          totalCount: item.collection?.totalCount,
          floorPrice: item.collection?.floorPrice,
        },
        platform: item.platform,
      }
    }) as NFTShortArray
  }

  async fetchAllByAddress(address: string) {
    if (address.startsWith('0x')) return []

    const encodedAddress = encodeAddress(address, 2)

    this.webSocket = await this.wsProvider()

    if (!this.webSocket) return []
    const nfts = await this.webSocket.query.uniques.account.keys(encodedAddress) // CollectionID, NFTID

    return this.useCache(address, this.name, nfts)
      .then((items: NFTDetailArray) => {
        // store the current set of items in this provider as a variable
        // so we can look up the details when needed
        this.items = items

        return this.parseShorts(items)
      })
      .catch(async store => {
        let nftRawAssetDetails: any = []
        for (let key of nfts) {
          const data = key.toHuman() as string[]
          nftRawAssetDetails.push({ collectionId: data[1], nftTokenId: data[2] })
        }

        const items = await Promise.all(
          nftRawAssetDetails.map(
            async (assetId: any) =>
              new Promise(async resolve => {
                const NFTdetails = await this.getTokenDetails(assetId)

                resolve({
                  id: NFTdetails?.id,
                  name: NFTdetails?.name,
                  description: NFTdetails?.description,
                  mediaUri: NFTdetails?.mediaUri,
                  thumb: NFTdetails?.mediaUri,
                  type: null,
                  serialNumber: assetId.nftTokenId,
                  platform: this.name,
                  platformUri: `${this.platformUri}${assetId.collectionId.replaceAll(',', '')}/${assetId.nftTokenId}`,
                  attributes: {},
                  collection: {
                    id: NFTdetails.collectionId,
                    totalCount: null,
                    floorPrice: null,
                  },
                  nftSpecificData: null,
                } as NFTDetail)
              })
          ) as NFTDetailArray
        )

        store(items)

        this.items = items

        return this.parseShorts(items)
      })
  }

  async fetchOneById(id: string) {
    const item = this.items.find(item => (item.id = id))
    return item as NFTDetail
  }
}
