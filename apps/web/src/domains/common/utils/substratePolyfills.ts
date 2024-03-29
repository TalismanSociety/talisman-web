import { type ApiPromise } from '@polkadot/api'
import BN from 'bn.js'
import { minutesToMilliseconds } from 'date-fns'

// Some chains incorrectly use these, i.e. it is set to values such as 0 or even 2
// Use a low minimum validity threshold to check these against
const THRESHOLD = new BN(1_000).divn(2)
const DEFAULT_TIME = new BN(6_000)

export const expectedBlockTime = (api: ApiPromise) =>
  // Babe, e.g. Relay chains (Substrate defaults)
  api.consts.babe?.expectedBlockTime ??
  // POW, eg. Kulupu
  api.consts['difficulty']?.['targetBlockTime'] ??
  // Subspace
  api.consts['subspace']?.['expectedBlockTime'] ??
  // Check against threshold to determine value validity
  (api.consts.timestamp?.minimumPeriod.gte(THRESHOLD)
    ? // Default minimum period config
      api.consts.timestamp.minimumPeriod.muln(2)
    : api.query.parachainSystem
    ? // default guess for a parachain
      DEFAULT_TIME.muln(2)
    : // default guess for others
      DEFAULT_TIME)

export const expectedSessionTime = (api: ApiPromise) => {
  switch (api.genesisHash.toString()) {
    // Aleph Zero
    case '0x70255b4d28de0fc4e1a193d7e175ad1ccef431598211c55538f1018651a0344e':
      return new BN(minutesToMilliseconds(15))
    // Astar
    case '0x9eb76c5184c4ab8679d2d5d819fdf90b9c001403e9e17da2e14b6d8aec4029c6':
      return expectedBlockTime(api).muln(7200)
    // Shibuya
    case '0xddb89973361a170839f80f152d2e9e38a376a5a7eccefcade763f46a8e567019':
      return expectedBlockTime(api).muln(1800)
    default:
      return new BN(
        (api.consts.babe?.epochDuration.toNumber() ?? api.registry.createType('u64', 1).toNumber()) *
          expectedBlockTime(api).toNumber()
      )
  }
}

export const expectedEraTime = (api: ApiPromise) => {
  const sessionsPerEra = api.consts.staking?.sessionsPerEra ?? api.registry.createType('SessionIndex', 1)
  const sessionTime = expectedSessionTime(api)

  return sessionsPerEra.mul(sessionTime).toNumber()
}
