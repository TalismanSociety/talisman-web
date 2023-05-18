import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { isAddress as isEvmAddress } from 'viem'

export const tryParseSubstrateOrEthereumAddress = (address: string) => {
  if (isEvmAddress(address)) {
    return address
  }

  try {
    return encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))
  } catch (error) {
    return undefined
  }
}
