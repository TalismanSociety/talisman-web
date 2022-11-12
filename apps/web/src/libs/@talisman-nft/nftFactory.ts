import { NFTInterface } from './providers/NFTInterface'
import SubscriptionService from './SubscriptionService'
import { NFTData, NFTShort } from './types'

type nftPlatformMapping = {
  [key: string]: string
}

export class NFTFactory extends SubscriptionService<NFTData> {
  providers: NFTInterface[]
  nftPlatformMapping: nftPlatformMapping = {}
  private providerData: { [providerName: string]: NFTData } = {}
  private address: string = ''

  constructor(providers: NFTInterface[]) {
    super()
    this.providers = providers

    this.providers.forEach(provider => {
      // Don't want to subscribe again
      provider.subscribe(() => this.triggerCallback())
    })
  }

  reset() {
    this.address = ''
  }

  hydrateNftsByAddress(address: string) {
    if (this.address === address) return
    this.address = address
    this.providers.forEach(provider => {
      provider.hydrateNftsByAddress(address)
    })
  }

  // create a return object & fire subscriptions
  private triggerCallback() {
    // init array
    let count: number = 0
    let fetchingArray: boolean[] = []
    let items: { [key: string]: NFTShort } = {}

    // iterate through the providers and parse info
    this.providers.forEach(provider => {
      count += provider.count
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
