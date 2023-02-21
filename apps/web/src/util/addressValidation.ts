import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { ethers } from 'ethers'

export const isValidSubstrateOrEthereumAddress = (address: string) => {
  if (ethers.utils.isAddress(address)) {
    return true
  }

  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}
