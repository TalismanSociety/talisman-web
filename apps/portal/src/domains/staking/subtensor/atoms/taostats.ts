import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

const TAOSTATS_DATA_URL = 'https://taostats.io/data.json'

// The taostats endpoint has a `network` field, which is the name of the network.
// This field is the only way to tell which network a given set of stats is for.
// This map lets us identify which `network` value to use as an id for each given genesisHash.
const TaostatsNetworkByGenesisHash = new Map([
  ['0x2f0555cc76fc2840a25a6ea3b9637146806f1f44b090c175ffde2a7e5ab36c03', 'Bittensor'],
])

type Taostats = Array<{
  network?: string // 'Bittensor'
  token?: string // 'TAO'
  price?: string // '365.73'
  '24h_change'?: string // '12.69'
  '24h_volume'?: string // '66990486.579526'
  current_supply?: string // '6923726'
  total_supply?: string // '21000000'
  delegated_supply?: string // '5744443'
  market_cap?: string // '2532203699'
  next_halvening?: string // '22 October 2025'
  daily_return_per_1000t?: string // '0.0010277758870616'
  validating_apy?: string // '18.77'
  staking_apy?: string // '17.08'
  last_updated?: string // '12 June 2024 16:54:08 GMT'
}>

export const taostatsAtom = atom(async () => {
  try {
    const stats = await (await fetch(TAOSTATS_DATA_URL)).json()
    return Array.isArray(stats) ? (stats as Taostats) : []
  } catch (cause) {
    throw new Error('Failed to fetch TAO stats', { cause })
  }
})

export const taostatsByChainAtomFamily = atomFamily((genesisHash: string | undefined) => {
  if (!genesisHash) return atom(() => Promise.resolve(undefined))

  const networkName = TaostatsNetworkByGenesisHash.get(genesisHash)
  if (!networkName) return atom(() => Promise.resolve(undefined))

  return atom(async get => (await get(taostatsAtom)).find(stats => stats.network === networkName))
})

export const stakingAprByChainAtomFamily = atomFamily((genesisHash: string | undefined) =>
  atom(async get => {
    const taostats = await get(taostatsByChainAtomFamily(genesisHash))
    return parseFloat(taostats?.staking_apy ?? '0.0') / 100
  })
)
