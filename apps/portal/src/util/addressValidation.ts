import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { isAddress as isEvmAddress, isHex } from 'viem'

export const tryParseSubstrateOrEthereumAddress = (address: string, options = { acceptSubstratePublicKey: true }) => {
  if (isEvmAddress(address)) {
    return address
  }

  if (isHex(address) && !options.acceptSubstratePublicKey) {
    return undefined
  }

  try {
    return encodeAddress(decodeAddress(address))
  } catch (error) {
    return undefined
  }
}
