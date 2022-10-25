import Web3 from 'web3'

import { NFTDetail, NFTShort, NFTShortArray } from '../../types'
import { NFTInterface } from '../NFTInterface'

export class EVMProvider extends NFTInterface {
  name = ''
  rpc = []
  contracts: any = {}
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
  ]
  platformUri = 'https://opensea.io/'
  storageProvider = ''
  web3: Web3 = new Web3()

  detailedItems: { [key: string]: any } = {}

  constructor(config: any) {
    super()
    this.name = config.name
    this.rpc = config.rpc
    this.contracts = config.contracts

    // Set the RPC
    this.web3.setProvider(this.rpc[0])

    this.web3.eth.net
      .isListening()
      .then(() => {
        console.log(`${this.name} RPC has connected.`)
      })
      .catch(e => {
        console.log('Could not connect to EVM RPC', e)
        return
      })
    // Ask Swami what would be a good way to go through each RPC and check if it's valid
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
      provider: item?.provider,
      fetchDetail: () => this.fetchDetail(item.id),
    }
  }

  async hydrateNftsByAddress(address: string) {
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
            const contractInstance = new this.web3.eth.Contract(this.abi, contract.address)
            const balance = await contractInstance.methods.balanceOf(address).call()
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
                      id: tokenId,
                      name: data.name,
                      thumb: this.toIPFSUrl(data.image),
                      description: data?.description,
                      serialNumber: data?.edition,
                      metadata: null,
                      type: null,
                      mediaUri: this.toIPFSUrl(data.image),
                      provider: this.name,
                      platformUri: '',
                      attributes: data?.attributes,
                      collection: {
                        id: contract.address,
                        name: contract.name,
                        totalCount: contract.totalSupply,
                      },
                      nftSpecificData: {
                        dataDump: data,
                      },
                    }

                    this.setItem(address, this.parseShort(nftItem))
                    this.detailedItems[nftItem.id] = nftItem

                    resolve(true)
                  })
              )
            )

            resolve(true)
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
