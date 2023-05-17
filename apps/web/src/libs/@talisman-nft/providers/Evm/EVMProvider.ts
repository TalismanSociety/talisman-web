import { ethers } from 'ethers'

import { type Contract, type EVMChain, type NFTDetail, type NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class EVMProvider extends NFTInterface {
  override name: string = ''
  rpc: string[] = []
  contracts: Contract = {}
  chainId: number
  abi: any = [
    {
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'uint256', name: 'index', type: 'uint256' },
      ],
      name: 'tokenOfOwnerByIndex',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ]

  platformUri = ''
  storageProvider = ''
  web3: ethers.providers.JsonRpcProvider | undefined = undefined

  storedAddress: string | undefined = undefined

  detailedItems: Record<string, any> = {}

  constructor(config: EVMChain) {
    super()
    this.name = config.name
    this.rpc = config.rpc
    this.contracts = config.contracts
    this.platformUri = config.platformUri
    this.tokenCurrency = config.tokenCurrency
    this.chainId = config.chainId
  }

  parseShort(item: any): NFTShort {
    return {
      id: item.id,
      name: item.name,
      thumb: item.thumb,
      type: item.type,
      mediaUri: item.mediaUri,
      metadata: item.metadata,
      collection: {
        id: item.collection?.id,
        name: item.collection?.name,
        totalCount: item.collection?.totalCount,
      },
      address: item.address,
      provider: item?.provider,
      fetchDetail: async () => await this.fetchDetail(item.id),
      nftSpecificData: null,
    }
  }

  typeCheck(mediaUri: string): string | undefined {
    if (!mediaUri) return undefined
    // check if media uri ends with png, jpg or gif
    if (mediaUri.endsWith('.png') || mediaUri.endsWith('.jpg') || mediaUri.endsWith('.gif')) {
      return 'image'
    }
    // check if media uri ends with mp4
    if (mediaUri.endsWith('.mp4')) {
      return 'video'
    }
    return undefined
  }

  override async hydrateNftsByAddress(address: string) {
    if (this.storedAddress === address) {
      return
    }

    this.storedAddress = address

    this.reset()
    this.isFetching = true

    // check if address is valid
    if (!ethers.utils.isAddress(address)) {
      this.isFetching = false
      return
    }

    const providers = await Promise.all(
      // map through each RPC on the list
      this.rpc.map(async rpc => {
        // Test the provider
        const provider = new ethers.providers.JsonRpcProvider(rpc)
        // Get the chainId of the provider
        const chainId = await provider
          .getNetwork()
          .then(network => network.chainId)
          .catch(() => undefined)

        // If the chainId does not match the chainId of the provider, return undefined
        if (chainId !== this.chainId || chainId === undefined) {
          return undefined
        }

        // If the chainId matches, return the provider
        return rpc
      })
    )

    // return first matching
    const provider = providers.find(p => p !== undefined)

    if (provider === undefined) {
      this.isFetching = false
      return
    }

    this.web3 = new ethers.providers.JsonRpcProvider(provider)
    this.count[address] = 0

    // we need to ...
    await Promise.all(
      Object.values(this.contracts).map(
        async (contract: any) =>
          // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
          await new Promise(async resolve => {
            try {
              const contractInstance = new ethers.Contract(contract.address, this.abi, this.web3)
              const balance = await contractInstance['balanceOf'](address)
              const totalCount = await contractInstance['totalSupply']()

              const bnBalance = ethers.BigNumber.from(balance).toNumber()
              const bnTotalCount = ethers.BigNumber.from(totalCount).toNumber()

              this.count[address] += bnBalance

              await Promise.all(
                Array.from(Array(bnBalance).keys()).map(
                  async i =>
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-async-promise-executor
                    await new Promise(async resolve => {
                      const tokenId = await contractInstance['tokenOfOwnerByIndex'](address, i)
                      const bnTokenId = ethers.BigNumber.from(tokenId).toNumber()
                      const tokenURI = await contractInstance['tokenURI'](tokenId)

                      const response = await fetch(tokenURI.replace('ipfs://', 'https://talisman.mypinata.cloud/ipfs/'))
                      const data = await response.json()

                      const nftItem = {
                        id: bnTokenId.toString() + '-' + (contract.name as string),
                        name: data.name,
                        thumb: this.toIPFSUrl(data.image),
                        description: data?.description,
                        serialNumber: data?.edition ?? bnTokenId ?? '-',
                        metadata: null,
                        type: this.typeCheck(data?.animation_url ?? data.image),
                        mediaUri: this.toIPFSUrl(data?.animation_url) ?? this.toIPFSUrl(data.image),
                        address,
                        provider: this.name,
                        platformUri: `${this.platformUri}${contract.address as string}`,
                        attributes: data?.attributes,
                        collection: {
                          id: contract.address,
                          name: contract.name,
                          totalCount: bnTotalCount,
                        },
                        nftSpecificData: {
                          dataDump: data,
                          isEvm: true,
                        },
                        tokenCurrency: this.tokenCurrency,
                      }

                      this.setItem(this.parseShort(nftItem))
                      this.detailedItems[nftItem.id] = nftItem

                      resolve(true)
                    })
                )
              )

              resolve(true)
            } catch (e) {
              console.log(e)
              resolve(true)
            }
          })
      )
    )

    this.isFetching = false
  }

  override fetchOneById(id: string) {
    const internalId = id.split('.').slice(1).join('.')
    return this.items[internalId]
  }

  protected override async fetchDetail(id: string): Promise<NFTDetail> {
    const item = this.detailedItems[id]
    return item
  }
}
