import { type NFTInterface } from './providers/NFTInterface'
import SubscriptionService from './SubscriptionService'
import { type NFTData, type NFTShort } from './types'

type nftPlatformMapping = Record<string, string>

export class NFTFactory extends SubscriptionService<NFTData> {
  providers: NFTInterface[]
  nftPlatformMapping: nftPlatformMapping = {}

  private addresses: string[] = []

  constructor(providers: NFTInterface[]) {
    super()
    this.providers = providers

    this.providers.forEach(provider => {
      // Don't want to subscribe again
      provider.subscribe(() => {
        this.triggerCallback()
      })
    })
  }

  reset() {
    this.addresses = []
  }

  hydrateNftsByAddress(address: string) {
    if (this.addresses.includes(address)) return
    this.addresses.push(address)

    this.providers.forEach(provider => {
      provider.hydrateNftsByAddress(address)
    })
  }

  // create a return object & fire subscriptions
  private triggerCallback() {
    // init array
    const count: Record<string, number> = {}
    const fetchingArray: boolean[] = []
    let items: Record<string, NFTShort> = {}

    // iterate through the providers and parse info
    this.providers.forEach(provider => {
      Object.keys(provider.count).forEach((address: string) => {
        if (count[address]) {
          count[address] += provider.count[address] ?? 0
        } else {
          count[address] = provider.count[address] ?? 0
        }
      })

      fetchingArray.push(provider.isFetching)
      items = { ...items, ...provider.items }
    })

    // fire the CB
    this.fire({
      count,
      isFetching: !!fetchingArray.includes(true),
      items: Object.values(items),
    })
  }

  fetchOneById(id: string): NFTShort | undefined {
    const providerId = id.split('.')[0]
    const provider = this.providers.find(provider => provider.name === providerId)

    if (!provider) throw new Error('TBD')

    const nft = provider.fetchOneById(id)

    return nft
  }
}
