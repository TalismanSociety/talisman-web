import { Chain, ChainList } from './types'

const parseChainList = (chains: Chain[]): ChainList =>
  chains.reduce((allChains: ChainList, chain: Chain) => ({ ...allChains, [chain.id]: chain }), {})

export default parseChainList
