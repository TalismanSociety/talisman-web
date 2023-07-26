import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useCallback } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { useChainDeriveState, useSubstrateApiState } from '..'

const erasToMilliseconds = (eras: BN, eraLength: BN, eraProgress: BN, expectedBlockTime: BN) =>
  eras.subn(1).mul(eraLength).add(eraLength).sub(eraProgress).mul(expectedBlockTime).toNumber()

export const useEraEtaFormatter = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useChainDeriveState('session', 'progress', [])])
  )

  return useCallback(
    (era: BN) =>
      formatDistanceToNow(
        addMilliseconds(
          new Date(),
          erasToMilliseconds(
            era,
            sessionProgress.eraLength,
            sessionProgress.eraProgress,
            api.consts.babe.expectedBlockTime
          )
        )
      ),
    [api.consts.babe.expectedBlockTime, sessionProgress.eraLength, sessionProgress.eraProgress]
  )
}
