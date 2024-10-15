import { encodeAddress } from '@polkadot/util-crypto'

export const convertAddressSs58 = (address: string, ss58prefix = 42) => {
  try {
    return encodeAddress(address, ss58prefix)
  } catch {
    return address
  }
}
