import { isNil } from 'lodash'
import md5 from 'md5'

import SubscriptionService from '../SubscriptionService'
import { type NFTData, type NFTDetail, type NFTDetailArray, type NFTShort } from '../types'

export class NFTInterface extends SubscriptionService<NFTData> {
  name: string = ''
  baseIPFSUrl: string = 'https://talisman.mypinata.cloud/ipfs/'
  tokenCurrency: string = ''
  _count: Record<string, number> = {}

  _isFetching: boolean = false
  _items: Record<string, NFTShort> = {}

  protected toIPFSUrl(url: string): string | null {
    if (url == null) return null

    if (url.startsWith('ipfs://ipfs/')) return url.replace('ipfs://ipfs/', this.baseIPFSUrl)

    if (url.startsWith('ipfs://')) return url.replace('ipfs://', this.baseIPFSUrl)

    return url
  }

  public hydrateNftsByAddress(_address: string) {}

  public fetchOneById(_id: string): NFTShort | undefined {
    return undefined
  }

  protected async fetchDetail(_id: string): Promise<NFTDetail> {
    // eslint-disable-next-line prefer-promise-reject-errors
    return await Promise.reject()
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
    return await fetch(`${collectionUri}${collectionId}`)
      .then(async res => await res.json())
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

  async fetchMediaFromMetadata(IPFSUrl: string | null | undefined) {
    if (isNil(IPFSUrl)) return
    return await fetch(IPFSUrl)
      .then(async res => await res.json())
      .then(data => {
        return this.toIPFSUrl(data.mediaUri)
      })
  }

  protected reset() {
    this.isFetching = false
    this.items = {}
    this.count = {}
  }

  set count(count: Record<string, number>) {
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

  set items(items: Record<string, NFTShort>) {
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
      fetchDetail: async () => await this.fetchDetail(item.id),
    }

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
  protected async useCache(address: string, protocol: string, data: any): Promise<NFTDetailArray> {
    // names of the storage items/keys/locations
    const storageKeyHash = `@talisman/nfts/${protocol}/${address}/hash`
    const storageKeyData = `@talisman/nfts/${protocol}/${address}/data`

    // hash the data we're about to store
    const dataHash = md5(JSON.stringify(data))

    // get the currently stored hash
    const storedDataHash = localStorage.getItem(storageKeyHash)

    const storeCachedData = (keyHash: string, data: NFTDetailArray) => {
      localStorage.setItem(`${storageKeyHash}`, keyHash)
      localStorage.setItem(`${storageKeyData}`, JSON.stringify(data))
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
    return await new Promise(async (resolve, reject) => {
      // if the data has changed from last time we stored it
      // return false/reject
      if (storedDataHash !== dataHash) {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
      }
      // if it hasn't changed, return the stored data
      else {
        try {
          // attempt to get the data from storage
          const storedDataString = localStorage.getItem(storageKeyData)
          if (!storedDataString) throw new Error('make a better error message') // @josh

          // attempt to parse the stored data into a json object
          const storedData: NFTDetailArray = JSON.parse(storedDataString)

          // return data
          resolve(storedData)
        } catch (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject((data: NFTDetailArray) => storeCachedData(dataHash, data))
        }
      }
    })
  }
}
