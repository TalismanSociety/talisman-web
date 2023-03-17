import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { ethers } from 'ethers'

export const tryParseSubstrateOrEthereumAddress = (address: string) => {
  if (ethers.utils.isAddress(address)) {
    return address
  }

  try {
    return encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
  } catch (error) {
    return undefined
  }
}
