import { Address } from '@util/addresses'
import { recoilPersist } from 'recoil-persist'

import { Multisig, TxOffchainMetadata } from './multisig'

function setAddressPrototype(a: any): Address {
  a.bytes = new Uint8Array(Object.values(a.bytes))
  Object.setPrototypeOf(a, Address.prototype)
  return a
}

// Need to manually set the prototype of deserialized Address instances.
type ParsedLocalStorage =
  | { Multisigs: Multisig[] }
  | { SelectedMultisig: Multisig }
  | { TxOffchainMetadata: { [key: string]: [TxOffchainMetadata, Date] } }
  | { AllowExtension: boolean }

export default recoilPersist({
  converter: {
    parse: (str: string) => {
      const parsed: ParsedLocalStorage = JSON.parse(str)

      if ('Multisigs' in parsed) {
        parsed.Multisigs.forEach(m => {
          setAddressPrototype(m.multisigAddress)
          setAddressPrototype(m.proxyAddress)
          m.signers.forEach(s => setAddressPrototype(s))
        })
      }

      if ('SelectedMultisig' in parsed) {
        setAddressPrototype(parsed.SelectedMultisig.multisigAddress)
        setAddressPrototype(parsed.SelectedMultisig.proxyAddress)
        parsed.SelectedMultisig.signers.forEach(s => setAddressPrototype(s))
      }

      if ('TxOffchainMetadata' in parsed) {
        Object.values(parsed.TxOffchainMetadata).forEach(([v]) => {
          if (v.changeConfigDetails) {
            v.changeConfigDetails.newMembers.forEach(m => setAddressPrototype(m))
          }
        })
      }
      if ('AllowExtension' in parsed) {
        // noop
      }

      return parsed
    },
    stringify: (obj: any) => JSON.stringify(obj),
  },
}).persistAtom
