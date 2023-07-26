import '@acala-network/types'

import { ApiPromise, WsProvider } from '@polkadot/api'
import { encodeAddress } from '@polkadot/util-crypto'

import { NFTCategory, NFTDetail, NFTDetailArray, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class AcalaProvider extends NFTInterface {
  name = 'Acala'
  uri = 'wss://acala-rpc-0.aca-api.network'
  platformUri = 'https://apps.acala.network/portfolio/nft/'
  storageProvider = ''
  detailedItems: { [key: string]: any } = {}
  tokenCurrency = 'ACA'

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

    const collectionIdFixed: string = collectionId.replaceAll(',', '')
    const nftTokenIdFixed: string = nftTokenId.replaceAll(',', '')

    // Until resolved or a better way is found, toHuman will be used so Acala NFTs can be shown.
    const collectionDetails = (await this.webSocket.query.ormlNFT.classes(collectionIdFixed)).unwrapOr(null)?.toHuman()
    if (!collectionDetails) return null

    const metadata = await this.fetchCollectionData(this.baseIPFSUrl + collectionDetails?.metadata + '/metadata.json')
      .then(res => res)
      .catch(err => console.log(err))

    // // Return the promised data for token details
    return Promise.resolve({
      id: `${collectionIdFixed}-${nftTokenIdFixed}`,
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
    if (!this.webSocket) {
      this.isFetching = false
      return
    }

    const encodedAddress = encodeAddress(address, 10)

    const nfts = await this.webSocket?.query?.ormlNFT?.tokensByOwner?.keys(encodedAddress)
    if (!nfts) {
      this.isFetching = false
      return
    }

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

        nftRawAssetDetails.map(async (assetId: any) => {
          const tokenDetails = await this.getTokenDetails(assetId)

          if (!tokenDetails) {
            this.count[address] -= 1
            return
          }

          if (tokenDetails) {
            const nftDetail = {
              id: tokenDetails?.id,
              name: tokenDetails?.name,
              description: tokenDetails?.description,
              mediaUri: tokenDetails?.mediaUri,
              thumb: tokenDetails?.mediaUri,
              type: await this.fetchNFTs_type(tokenDetails?.mediaUri),
              metadata: tokenDetails,
              serialNumber: assetId.nftTokenId.replaceAll(',', ''),
              provider: this.name,
              platformUri: `${this.platformUri}`,
              attributes: {},
              collection: {
                id: tokenDetails.collectionId,
                totalCount: null,
                floorPrice: null,
              },
              nftSpecificData: null,
              tokenCurrency: this.tokenCurrency,
              address,
            }

            // console.log(nftDetail)

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
