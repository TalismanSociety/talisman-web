import { encodeAnyAddress } from '@talismn/util'

export const formatGenericAddress = (address: string) =>
  address.startsWith('0x') ? address.toLowerCase() : encodeAnyAddress(address)
