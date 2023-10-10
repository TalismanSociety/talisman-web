import { Address } from '@util/addresses'
import { recoilPersist } from 'recoil-persist'

import { supportedChains } from './chains'
import { Multisig, TxOffchainMetadata } from './multisig'

function setAddressPrototype(a: any): void {
  a.bytes = new Uint8Array(Object.values(a.bytes))
  Object.setPrototypeOf(a, Address.prototype)
}

// Need to manually set the prototype of deserialized Address instances.
type ParsedLocalStorage =
  | { Multisigs: Multisig[] }
  | { SelectedMultisig: Multisig }
  | { TxOffchainMetadata: { [key: string]: [TxOffchainMetadata, Date] } }
  | { AllowExtension: boolean }

function initMultisig(m: Multisig) {
  setAddressPrototype(m.multisigAddress)
  setAddressPrototype(m.proxyAddress)
  m.signers.forEach(s => setAddressPrototype(s))
  // Refresh Chain definitions if they have changed
  const latestChain = supportedChains.find(c => c.squidIds.chainData === m.chain.squidIds.chainData)
  if (latestChain) m.chain = latestChain
  if (!m.id) m.id = `${m.multisigAddress.toSs58()}-${m.proxyAddress.toSs58()}-${m.chain.squidIds.chainData}`
}

export default recoilPersist({
  converter: {
    parse: (str: string) => {
      const parsed: ParsedLocalStorage = JSON.parse(str)

      if ('Multisigs' in parsed) {
        parsed.Multisigs.forEach(m => initMultisig(m))
      }

      if ('SelectedMultisig' in parsed) {
        initMultisig(parsed.SelectedMultisig)
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
