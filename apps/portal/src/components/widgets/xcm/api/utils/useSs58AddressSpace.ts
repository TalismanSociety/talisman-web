import { AnyChain, Parachain } from '@galacticcouncil/xcm-core'

export const useSs58AddressSpace = (chain: AnyChain) => (chain instanceof Parachain ? !chain.usesH160Acc : false)
