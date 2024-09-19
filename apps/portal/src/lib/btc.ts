import { type Account } from '@/domains/accounts'
import { address } from 'bitcoinjs-lib'

export type BtcAccountType = 'btc-base58' | 'btc-bench32'
export type BtcAccount = Omit<Account, 'type'> & {
  readonly: true
  partOfPortfolio: false
  canSignEvm: false
  genesisHash: null
  name: undefined
  origin: 'local'
  type: BtcAccountType
}
export type AccountWithBtc = Account | BtcAccount

export const isBtcAddress = (text: string): BtcAccount | null => {
  try {
    address.fromBech32(text)
    return {
      address: text,
      type: 'btc-bench32',
      partOfPortfolio: false,
      readonly: true,
      canSignEvm: false,
      genesisHash: null,
      name: undefined,
      origin: 'local',
    }
  } catch (e) {
    // try next address type
  }

  try {
    address.fromBase58Check(text)
    return {
      address: text,
      type: 'btc-base58',
      partOfPortfolio: false,
      readonly: true,
      canSignEvm: false,
      genesisHash: null,
      name: undefined,
      origin: 'local',
    }
  } catch (e) {
    // do nothing
  }

  return null
}
