import { Address } from '@util/addresses'
import { BaseToken } from '@domains/chains'

export interface MultiSendSend {
  token: BaseToken
  address: Address
  amount: string
}
