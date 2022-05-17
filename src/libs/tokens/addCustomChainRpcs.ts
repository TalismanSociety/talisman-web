import type { Chain, ChainId } from './types'

const customRpcs: Record<ChainId, string[]> = {
  'acala': ['wss://acala-polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'altair': ['wss://altair.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'astar': ['wss://astar.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'automata': ['wss://automata.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'basilisk': ['wss://basilisk.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'bifrost-ksm': ['wss://bifrost-parachain.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'bit-country-pioneer': ['wss://pioneer.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'calamari': ['wss://calamari.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'clover': ['wss://clover.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'compound': ['wss://compound.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'contextfree': ['wss://contextfree.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'darwinia-crab': ['wss://darwinia-crab.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'edgeware': ['wss://edgeware.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'karura': ['wss://karura.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'khala': ['wss://khala.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'kilt-spiritnet': ['wss://spiritnet.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'kintsugi-btc': ['wss://kintsugi.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'kusama': ['wss://kusama.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'moonbeam': ['wss://moonbeam.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'moonbeam-alpha': ['wss://moonbeam-alpha.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'moonriver': ['wss://moonriver.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'neumann': ['wss://neumann.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'nodle': ['wss://nodle.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'parallel': ['wss://parallel.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'parallel-heiko': ['wss://parallel-heiko.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'polkadot': ['wss://polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'quartz': ['wss://quartz.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'shiden': ['wss://shiden.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'sora': ['wss://sora.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'statemine': ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'statemint': ['wss://statemint.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
  'westend': ['wss://westend.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'],
}

const addCustomChainRpcs = (chains: Chain[]): Chain[] =>
  chains.map(chain => {
    if (!chain.isHealthy) return chain

    if (!customRpcs[chain.id]) return chain

    const chainWithCustomRpcs = { ...chain }

    chainWithCustomRpcs.rpcs = [...customRpcs[chain.id].map(url => ({ url, isHealthy: true })), ...(chain.rpcs || [])]

    return chainWithCustomRpcs
  })

export default addCustomChainRpcs
