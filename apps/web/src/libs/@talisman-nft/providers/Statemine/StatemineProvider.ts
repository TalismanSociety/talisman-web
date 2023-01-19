import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTCategory, NFTDetail, NFTDetailArray, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class StatemineProvider extends NFTInterface {
  name = 'StateMine'
  uri = 'wss://statemine.api.onfinality.io/public-ws'
  platformUri = 'https://singular.app/collectibles/statemine/'
  storageProvider = ''
  detailedItems: { [key: string]: any } = {}
  tokenCurrency = 'KSM'

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
    // For some reason, there are commas in the collection ID and NFTTokenID, removed them.
    let collectionIdFixed = collectionId.replaceAll(',', '')
    let nftTokenIdFixed = nftTokenId.replaceAll(',', '')

    // Fetch the metadata of the NFT by querying the collection ID and NFT item number. Since the return is toHuman(). We are unsure of the return type, so we use any.
    const metadataNft: any = (
      await this.webSocket.query.uniques.instanceMetadataOf(collectionIdFixed, nftTokenIdFixed)
    ).toHuman()

    // A check to see if there is any metadata, without the metadata, we're unable to fetch the media of the NFT.
    // Hence, we return null. Which will disregard the NFT altogether.
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
    let cat: string | undefined = 'unknown'

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
      metadata: undefined,
      nftSpecificData: undefined,
      collection: {
        id: item.collection?.id,
        totalCount: item.collection?.totalCount,
        floorPrice: item.collection?.floorPrice,
      },
      provider: item?.provider,
      address: item?.address,
    } as NFTShort
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

    const encodedAddress = encodeAddress(address, 2)

    const nfts = await this.webSocket.query.uniques.account.keys(encodedAddress) // CollectionID, NFTID
    this.count[address] = nfts.length

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

        nftRawAssetDetails.map(async (assetId: any): Promise<any> => {
          const tokenDetails = await this.getTokenDetails(assetId)

          // If there is no token details, disregard the NFT and remove it from the count.
          if (!tokenDetails) this.count[address] -= 1

          if (tokenDetails) {
            const nftDetail = {
              id: tokenDetails?.id,
              name: tokenDetails?.name,
              thumb: tokenDetails?.mediaUri,
              type: undefined,
              metadata: undefined,
              mediaUri: tokenDetails?.mediaUri,
              provider: this.name,
              address,
              collection: {
                id: tokenDetails.collectionId,
                totalCount: undefined,
                floorPrice: undefined,
              },
              description: tokenDetails?.description,
              serialNumber: assetId.nftTokenId,
              attributes: {},
              nftSpecificData: undefined,
              platformUri: `${this.platformUri}${assetId.collectionId.replaceAll(',', '')}/${assetId.nftTokenId}`,
              tokenCurrency: this.tokenCurrency,
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
