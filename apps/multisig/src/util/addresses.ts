const { decodeAddress, encodeAddress } = require('@polkadot/keyring')
const { hexToU8a, isHex } = require('@polkadot/util')

export const toSs52Address = (addressCandidate: string): string | false => {
  try {
    const address = encodeAddress(
      isHex(addressCandidate) ? hexToU8a(addressCandidate) : decodeAddress(addressCandidate)
    )

    return address
  } catch (error) {
    return false
  }
}
