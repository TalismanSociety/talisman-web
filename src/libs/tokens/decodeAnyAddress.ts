import { decodeAddress } from '@polkadot/keyring'
import { hexToU8a } from '@polkadot/util'
import { isEthereumAddress } from '@polkadot/util-crypto'

const decodeAnyAddress = (
  encoded?: string | Uint8Array | null | undefined,
  ignoreChecksum?: boolean | undefined,
  ss58Format?: number | undefined
): Uint8Array => {
  try {
    return decodeAddress(encoded, ignoreChecksum, ss58Format)
  } catch (error) {
    if (typeof encoded !== 'string') throw error
    if (!isEthereumAddress(encoded)) throw error

    return hexToU8a(encoded.slice('0x'.length))
  }
}

export default decodeAnyAddress
