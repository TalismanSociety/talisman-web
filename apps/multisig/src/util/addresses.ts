import { Chain } from '@domains/chains'
import { createKeyMulti, decodeAddress, encodeAddress, sortAddresses } from '@polkadot/util-crypto'
const { hexToU8a, isHex, u8aToHex } = require('@polkadot/util')

// Represent addresses as bytes except for when we need to display them to the user.
// Allows us to confidently do stuff like equality checks, don't need to worry about SS52 encoding.
export class Address {
  readonly bytes: Uint8Array

  constructor(bytes: Uint8Array) {
    if (bytes.length !== 32) throw new Error('Address must be 32 bytes!')
    this.bytes = bytes
  }

  static fromSs58(addressCandidate: string): Address | false {
    try {
      const bytes = isHex(addressCandidate)
        ? (hexToU8a(addressCandidate) as Uint8Array)
        : decodeAddress(addressCandidate, false)
      return new Address(bytes)
    } catch (error) {
      return false
    }
  }

  static fromPubKey(pubKey: string): Address | false {
    const bytes = new Uint8Array(hexToU8a(pubKey))
    if (bytes.length !== 32) return false
    return new Address(bytes)
  }

  static sortAddresses(addresses: Address[]): Address[] {
    return sortAddresses(addresses.map(a => a.bytes)).map(a => Address.fromSs58(a) as Address)
  }

  isEqual(other: Address): boolean {
    return this.bytes.every((byte, index) => byte === other.bytes[index])
  }

  toSs58(chain: Chain): string {
    return encodeAddress(this.bytes, chain.ss58Prefix)
  }

  toPubKey(): string {
    return u8aToHex(this.bytes)
  }

  toSubscanUrl(chain: Chain): string {
    return `https://${chain.chainName.toLowerCase()}.subscan.io/account/${this.toSs58(chain)}`
  }
}

export const toMultisigAddress = (signers: Address[], threshold: number): Address => {
  // Derive the multisig address
  const multiAddressBytes = createKeyMulti(sortAddresses(signers.map(s => s.bytes)), threshold)
  return new Address(multiAddressBytes)
}
