import { AnyChain } from '@galacticcouncil/xcm-core'

import { convertAddressSs58 } from './convertAddressSs58'
import { convertToH160 } from './convertH160'
import { shouldUseH160AddressSpace } from './shouldUseH160AddressSpace'

export const formatAddress = (address: string, chain: AnyChain) =>
  shouldUseH160AddressSpace(chain) ? convertToH160(address) : convertAddressSs58(address)
