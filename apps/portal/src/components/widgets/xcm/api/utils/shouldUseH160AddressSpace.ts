import { AnyChain, Parachain } from '@galacticcouncil/xcm-core'

export const shouldUseH160AddressSpace = (chain: AnyChain) =>
  chain instanceof Parachain ? chain.usesH160Acc : chain.isEvmChain()
