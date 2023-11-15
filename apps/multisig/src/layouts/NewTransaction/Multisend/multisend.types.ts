import { Address } from '@util/addresses'
import { BaseToken } from '@domains/chains'
import BN from 'bn.js'

export interface MultiSendSend {
  token: BaseToken
  address: Address
  amountBn: BN
}
