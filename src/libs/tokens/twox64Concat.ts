import { u8aConcat, u8aToHex, u8aToU8a } from '@polkadot/util'
import { xxhashAsU8a } from '@polkadot/util-crypto'

const bitLength = 64

const twox64Concat = (input: string | Buffer | Uint8Array): `0x${string}` => {
  return u8aToHex(u8aConcat(xxhashAsU8a(input, bitLength), u8aToU8a(input)))
}

export default twox64Concat
