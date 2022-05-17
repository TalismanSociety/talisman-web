import { u8aConcat, u8aToHex, u8aToU8a } from '@polkadot/util'
import { blake2AsU8a } from '@polkadot/util-crypto'

const bitLength = 128

const blake2Concat = (input: Uint8Array): `0x${string}` => {
  return u8aToHex(u8aConcat(blake2AsU8a(input, bitLength), u8aToU8a(input)))
}

export default blake2Concat
