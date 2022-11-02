import { useEffect, useState } from 'react'

import { defaultNftFactoryCallbackData } from './config'
import { NFTFactory } from './nftFactory'
import { EVMProvider, Rmrk1Provider, Rmrk2Provider, StatemineProvider } from './providers'
import { EVMChains } from './providers/Evm/EVMChains'
import { NFTInterface } from './providers/NFTInterface'
import { EVMChain, NFTData, NFTDetail, NFTShort } from './types'

// Base providers
const providers: NFTInterface[] = [
  new Rmrk1Provider(),
  new Rmrk2Provider(),
  new StatemineProvider(),
  // new AcalaProvider(),
]

// EVM Related Providers

Object.values(EVMChains).map((chain: EVMChain) => providers.push(new EVMProvider(chain)))

const nftFactory = new NFTFactory(providers)

export const useNftsByAddress = (initialAddress?: string) => {
  const [address, setAddress] = useState<string | undefined>(initialAddress)
  const [nftData, setNftData] = useState<NFTData>(defaultNftFactoryCallbackData)

  useEffect(() => {
    nftFactory.reset()
  })

  useEffect(() => {
    if (!address) return

    const unsub = nftFactory.subscribe(setNftData)
    nftFactory.hydrateNftsByAddress(address)
    return unsub
  }, [address])

  return {
    setAddress,
    nftData,
  }
}

export const useNftById = (id?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [nft, setNft] = useState<NFTShort | NFTDetail>()
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    const short = nftFactory.fetchOneById(id)
    if (!short) {
      setError('NFT not found')
      setLoading(false)
      return
    }

    setNft(short)
    short.fetchDetail().then((nft: NFTDetail) => {
      setNft(nft)
      setLoading(false)
    })
  }, [id])

  return {
    nft,
    loading,
    error,
  }
}

export async function getNFTType(mediaUri: string) {
  if (!mediaUri) return 'unknown'
  try {
    const req = await fetch(mediaUri, { method: 'HEAD' })
    return req.headers.get('content-type')?.split('/')[0] ?? 'unknown'
  } catch (err) {
    console.log(err)
    return 'unknown'
  }
}
