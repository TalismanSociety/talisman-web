import Web3 from 'web3'
import { provider } from 'web3-core'

import { Contract, EVMChain, NFTDetail, NFTShort } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class EVMProvider extends NFTInterface {
  name: string = ''
  rpc: provider[] = []
  contracts: Contract = {}
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
  web3: Web3 = new Web3()

  storedAddress: string | undefined = undefined

  detailedItems: { [key: string]: any } = {}

  constructor(config: EVMChain) {
    super()
    this.name = config.name
    this.rpc = config.rpc
    this.contracts = config.contracts
    this.platformUri = config.platformUri
    this.tokenCurrency = config.tokenCurrency

    // Go through each RPC, and try to connect to it by testing the connection with isListening, if it works, we use it, if it doesn't, we try the next one
    // this.rpc.forEach(async (rpc: string) => {
    //   this.web3.setProvider(rpc)
    //   const isListening = await this.web3.eth.net.isListening()
    //   .then(() => {
    //     return true
    //   })
    //   .catch(() => {
    //     this.web3.setProvider('')
    //     return false
    //   })
    //   if (isListening && !this.web3.currentProvider) {
    //     this.web3.setProvider(rpc)
    //   }
    // })

    const rpc = this.rpc[0]

    if (rpc === undefined) {
      throw new Error('No rpc connection found')
    }

    this.web3.setProvider(rpc)

    this.web3.eth.net
      .isListening()
      .then(() => {
        console.log(`${this.name.toUpperCase()} RPC has connected.`)
      })
      .catch(e => {
        console.log('Could not connect to EVM RPC', e)
        return
      })
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
      fetchDetail: () => this.fetchDetail(item.id),
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

  async hydrateNftsByAddress(address: string) {
    if (this.storedAddress === address) {
      return
    }

    this.storedAddress = address

    this.reset()
    this.isFetching = true

    if (!this.web3.utils.isAddress(address)) {
      this.isFetching = false
      return
    }

    // we need to ...
    await Promise.all(
      Object.values(this.contracts).map(
        (contract: any) =>
          new Promise(async resolve => {
            try {
              const contractInstance = new this.web3.eth.Contract(this.abi, contract.address)

              const balance = (await contractInstance.methods.balanceOf(address).call()) ?? 0
              const totalCount = (await contractInstance.methods.totalSupply().call()) ?? 0

              this.count += parseInt(balance)

              await Promise.all(
                Array.from(Array(parseInt(balance)).keys()).map(
                  i =>
                    new Promise(async resolve => {
                      const tokenId = await contractInstance.methods.tokenOfOwnerByIndex(address, i).call()
                      const tokenURI = await contractInstance.methods.tokenURI(tokenId).call()

                      const response = await fetch(tokenURI.replace('ipfs://', 'https://talisman.mypinata.cloud/ipfs/'))
                      const data = await response.json()

                      const nftItem = {
                        id: tokenId + '-' + contract.name,
                        name: data.name,
                        thumb: this.toIPFSUrl(data.image),
                        description: data?.description,
                        serialNumber: data?.edition ?? '-',
                        metadata: null,
                        type: this.typeCheck(data?.animation_url ?? data.image),
                        mediaUri: this.toIPFSUrl(data?.animation_url) ?? this.toIPFSUrl(data.image),
                        address,
                        provider: this.name,
                        platformUri: `${this.platformUri}${contract.address}`,
                        attributes: data?.attributes,
                        collection: {
                          id: contract.address,
                          name: contract.name,
                          totalCount,
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

  fetchOneById(id: string) {
    const internalId = id.split('.').slice(1).join('.')
    return this.items[internalId]
  }

  protected async fetchDetail(id: string): Promise<NFTDetail> {
    const item = this.detailedItems[id]
    return item
  }
}
