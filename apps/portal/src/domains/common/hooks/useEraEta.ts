import { useSubstrateApiState } from '..'
import { Maybe } from '../../../util/monads'
import { expectedBlockTime, expectedSessionTime } from '../utils/substratePolyfills'
import { useDeriveState } from '@talismn/react-polkadot-api'
import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useCallback } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const erasOrSessionsRemaining = (current: BN, length: BN, progress: BN) =>
  current.subn(1).mul(length).add(length).sub(progress)

export const useEraEtaFormatter = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  return useCallback(
    (erasOrSessions: BN | number) => {
      const remaining = erasOrSessionsRemaining(
        new BN(erasOrSessions),
        sessionProgress.eraLength,
        sessionProgress.eraProgress
      )

      if (!sessionProgress.isEpoch) {
        return Maybe.of(expectedSessionTime(api)).mapOr(`${remaining.toString()} sessions`, sessionLength =>
          formatDistanceToNow(addMilliseconds(new Date(), remaining.mul(sessionLength).toNumber()))
        )
      }

      return formatDistanceToNow(addMilliseconds(new Date(), remaining.mul(expectedBlockTime(api)).toNumber()))
    },
    [api, sessionProgress.eraLength, sessionProgress.eraProgress, sessionProgress.isEpoch]
  )
}

export const useEraEta = (era: number) => useEraEtaFormatter()(era)
