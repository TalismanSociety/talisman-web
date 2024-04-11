const customRpcs: Record<string, string[]> = {
  '0': [], // ['wss://polkadot.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Polkadot Relay
  '0-1000': [], // ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Statemint
  '0-2000': [], // ['wss://acal.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Acala
  // '0-2001': [], // Bifrost
  // '0-2002': [], // ['wss://clover.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Clover
  // '0-2003': [], // Darwinia
  '0-2004': [], // ['wss://moonbeam.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Moonbeam
  '0-2006': [], // ['wss://astar.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Astar
  '0-2008': [], // Crust
  '0-2011': [], // Equilibrium
  '0-2012': [], // ['wss://parallel.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Parallel
  // '0-2013': [], // Litentry
  '0-2015': [], // Manta
  '0-2017': [], // SubGame Gamma
  // '0-2018': [], // SubDAO
  // '0-2019': [], // Composable Finance
  // '0-2021': [], // Efinity
  // '0-2026': [], // Nodle
  // '0-2027': [], // Coinversation
  // '0-2028': [], // Ares Odyssey
  // '0-2031': [], // Centrifuge
  '0-2032': [], // Interlay
  // '0-2034': [], // HydraDX
  // '0-2035': [], // Phala Network
  '2': [], // ['wss://kusama.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Kusama Relay
  '2-1000': [], // ['wss://statemine.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Statemine
  // '2-1001': [], // Encointer Network
  '2-2000': [], // ['wss://karura.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Karura
  '2-2001': [], // ['wss://bifrost-parachain.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Bifrost
  '2-2004': [], // ['wss://khala.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Khala
  // '2-2005': [], // KILT Spiritnet
  // '2-2006': [], // Darwinia Crab Redirect
  '2-2007': [], // ['wss://shiden.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Shiden
  // '2-2008': [], // Mars
  // '2-2009': [], // PolkaSmith by PolkaFoundry
  // '2-2012': [], // Crust Shadow
  // '2-2013': [], // SherpaX
  // '2-2014': [], // Encointer Canary
  // '2-2015': [], // Integritee Network
  // '2-2016': [], // Sakura
  // '2-2018': [], // SubGame Gamma
  // '2-2019': [], // Kpron
  // '2-2021': [], // Altair
  '2-2023': [], // ['wss://moonriver.api.onfinality.io/ws?apikey=e1b2f3ea-f003-42f5-adf6-d2e6aa3ecfe4'], // Moonriver
  // '2-2024': [], // Genshiro
  // '2-2048': [], // Robonomics
  // '2-2080': [], // Loom Network
  // '2-2082': [], // Basilisk
  '2-2084': [], // Calamari
  // '2-2085': [], // Parallel Heiko
  '2-2086': [], // KILT Spiritnet
  // '2-2087': [], // Picasso
  '2-2088': [], // Altair
  // '2-2089': [], // Genshiro
  '2-2090': [], // Basilisk
  // '2-2092': [], // Kintsugi BTC
  // '2-2094': [], // Unorthodox
  // '2-2095': [], // QUARTZ by UNIQUE
  // '2-2096': [], // Bit.Country Pioneer
  // '2-2100': [], // Subsocial
  // '2-2101': [], // Zeitgeist
  // '2-2102': [], // Pichiu
  // '2-2105': [], // Darwinia Crab
}

export default customRpcs
