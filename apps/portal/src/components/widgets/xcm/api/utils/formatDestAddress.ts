import { addr, AnyChain } from '@galacticcouncil/xcm-core'

import { convertFromH160 } from './convertH160'

export const formatDestAddress = (address: string, chain: AnyChain) =>
  chain.key === 'hydration' && addr.isH160(address) ? convertFromH160(address) : address
