import type BN from 'bn.js'

export const erasToMilliseconds = (eras: BN, eraLength: BN, eraProgress: BN, expectedBlockTime: BN) =>
  eras.subn(1).mul(eraLength).add(eraLength).sub(eraProgress).mul(expectedBlockTime).toNumber()
