import { type ApiPromise } from '@polkadot/api'
import BN from 'bn.js'

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
