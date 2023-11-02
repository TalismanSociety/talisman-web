import { Address } from '@util/addresses'
import { Chain } from '../chains'

export interface Multisig {
  id: string
  name: string
  chain: Chain
  multisigAddress: Address
  proxyAddress: Address
  signers: Address[]
  threshold: number
}
