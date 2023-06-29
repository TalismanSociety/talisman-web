import { useDeriveState } from '@talismn/react-polkadot-api'
import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useCallback } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { useSubstrateApiState } from '..'
import { expectedBlockTime } from '../utils/substratePolyfills'

const erasToMilliseconds = (eras: BN, eraLength: BN, eraProgress: BN, expectedBlockTime: BN) =>
  eras.subn(1).mul(eraLength).add(eraLength).sub(eraProgress).mul(expectedBlockTime).toNumber()

export const useEraEtaFormatter = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  return useCallback(
    (era: BN | number) => {
      if (!sessionProgress.isEpoch) {
        return `${new BN(era).mul(sessionProgress.eraLength).toString()} sessions`
      }

      return formatDistanceToNow(
        addMilliseconds(
          new Date(),
          erasToMilliseconds(
            new BN(era),
            sessionProgress.eraLength,
            sessionProgress.eraProgress,
            expectedBlockTime(api)
          )
        )
      )
    },
    [api, sessionProgress.eraLength, sessionProgress.eraProgress, sessionProgress.isEpoch]
  )
}
