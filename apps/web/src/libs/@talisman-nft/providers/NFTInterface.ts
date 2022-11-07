import md5 from 'md5'

import SubscriptionService from '../SubscriptionService'
import { NFTData, NFTDetail, NFTDetailArray, NFTShort } from '../types'

export class NFTInterface extends SubscriptionService<NFTData> {
  name: string = ''
  baseIPFSUrl: string = 'https://talisman.mypinata.cloud/ipfs/'
  tokenCurrency: string = ''
  _count: number = 0
  _isFetching: boolean = false
  _items: { [key: string]: NFTShort } = {}

  protected toIPFSUrl(url: string): string | null {
    if (url == null) return null

    if (url.startsWith('ipfs://ipfs/')) return url.replace('ipfs://ipfs/', this.baseIPFSUrl)

    if (url.startsWith('ipfs://')) return url.replace('ipfs://', this.baseIPFSUrl)

    return url
  }

  public hydrateNftsByAddress(address: string) {}

  public fetchOneById(id: string): NFTShort | null {
    return null
  }

  protected async fetchDetail(id: string): Promise<NFTDetail> {
    return Promise.reject()
  }

  public async fetchContentType(mediaUri?: string | null) {
    if (!mediaUri) return null
    try {
      const req = await fetch(mediaUri, { method: 'HEAD' })
      return req.headers.get('content-type')?.split('/')[0] ?? null
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async fetchNFTs_CollectionInfo(collectionId: string, collectionUri: string) {
    if (collectionId == null) return
    return fetch(`${collectionUri}${collectionId}`)
      .then(res => res.json())
      .then(data => {
        if (!data)
          return {
            totalNfts: null,
            floor: null,
          }

        return {
          totalNfts: data.totalNFTs,
          floor: (parseFloat(data.floor) / 1000000000000).toFixed(3),
        }
      })
  }

  async fetchMediaFromMetadata(IPFSUrl: string) {
    if (IPFSUrl == null) return
    return fetch(IPFSUrl)
      .then(res => res.json())
      .then(data => {
        return this.toIPFSUrl(data.mediaUri)
      })
  }

  protected reset() {
    this.isFetching = false
    this.items = {}
    this.count = 0
  }

  set count(count: number) {
    this._count = count
    this.triggerCallback()
  }

  get count() {
    return this._count
  }

  set isFetching(isFetching: boolean) {
    this._isFetching = isFetching
    this.triggerCallback()
  }

  get isFetching() {
    return this._isFetching
  }

  set items(items: { [key: string]: NFTShort }) {
    this._items = items
    this.triggerCallback()
  }

  get items() {
    return this._items
  }

  // set a single item
  setItem(item: NFTShort | NFTDetail) {
    this._items[item.id] = {
      ...item,
      id: `${this.name}.${item.id}`,
      fetchDetail: () => this.fetchDetail(item.id),
    }

    // c

    this.triggerCallback()
  }

  private triggerCallback() {
    const rntData = {
      count: this.count,
      isFetching: this.isFetching,
      items: Object.values(this.items),
    }

    this.fire(rntData)
  }

  // use the cacehed data if available
  // address: address of the NFTs we're storing
  // protocol: protocol name ie RMRK1
  // data: the data to store in order to run a match next time we ask
  protected useCache(address: string, protocol: string, data: any): Promise<NFTDetailArray> {
    // names of the storage items/keys/locations
    const storageKey_hash = `@talisman/nfts/${protocol}/${address}/hash`
    const storageKey_data = `@talisman/nfts/${protocol}/${address}/data`

    // hash the data we're about to store
    const dataHash = md5(JSON.stringify(data))

    // get the currently stored hash
    const storedDataHash = localStorage.getItem(storageKey_hash)

    const storeCachedData = (keyHash: string, data: NFTDetailArray) => {
      localStorage.setItem(`${storageKey_hash}`, keyHash)
      localStorage.setItem(`${storageKey_data}`, JSON.stringify(data))
    }

    return new Promise(async (resolve, reject) => {
      // if the data has changed from last time we stored it
      // return false/reject
      if (storedDataHash !== dataHash) {
        reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
      }
      // if it hasn't changed, return the stored data
      else {
        try {
          // attempt to get the data from storage
          const storedDataString = localStorage.getItem(storageKey_data)
          if (!storedDataString) throw new Error('make a better error message') // @josh

          // attempt to parse the stored data into a json object
          const storedData: NFTDetailArray = JSON.parse(storedDataString)

          // return data
          resolve(storedData)
        } catch (error) {
          reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
        }
      }
    })
  }
}
