import { Buffer } from 'buffer'

import { HYDRADX_SS58_PREFIX } from '@galacticcouncil/sdk'
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto'

const ETH_PREFIX = 'ETH\0'

export const convertFromH160 = (h160Addr: string, ss58prefix = HYDRADX_SS58_PREFIX) => {
  const addressBytes = Buffer.from(h160Addr.slice(2), 'hex')
  const prefixBytes = Buffer.from(ETH_PREFIX)
  const convertBytes = Uint8Array.from(Buffer.concat([prefixBytes, addressBytes, Buffer.alloc(8)] as any))
  return encodeAddress(convertBytes, ss58prefix)
}

export const convertToH160 = (ss58Addr: string) => {
  const decodedBytes = decodeAddress(ss58Addr)
  const prefixBytes = Buffer.from(ETH_PREFIX)
  const addressBytes = decodedBytes.slice(prefixBytes.length, -8)
  return '0x' + Buffer.from(addressBytes).toString('hex')
}
