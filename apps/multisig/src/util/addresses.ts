import { Chain } from '@domains/chains'

const { decodeAddress, encodeAddress } = require('@polkadot/keyring')
const { hexToU8a, isHex } = require('@polkadot/util')

export const toSs52Address = (addressCandidate: string, chain: Chain | null): string | false => {
  try {
    const address = encodeAddress(
      isHex(addressCandidate) ? hexToU8a(addressCandidate) : decodeAddress(addressCandidate),
      chain?.ss58Prefix
    )

    return address
  } catch (error) {
    return false
  }
}

export const toSubscanUrl = (inputAddress: string, chain: Chain | null): string => {
  try {
    const ss52Address = toSs52Address(inputAddress, chain)
    if (!ss52Address) throw new Error('Invalid address')
    if (chain) {
      return `https://${chain?.chainName.toLowerCase()}.subscan.io/account/${ss52Address}`
    } else {
      return `https://subscan.io/account/${ss52Address}`
    }
  } catch (error) {
    console.error('Tried to create a Subscan URL with an invalid address.')
    return `https://subscan.io/account/${inputAddress}`
  }
}
