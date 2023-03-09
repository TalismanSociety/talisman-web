import { apiState } from '@domains/chains/recoils'
import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useRecoilValue } from 'recoil'

import useChainState from './useChainState'

const erasToMilliseconds = (eras: BN, eraLength: BN, eraProgress: BN, expectedBlockTime: BN) =>
  eras.subn(1).mul(eraLength).add(eraLength).sub(eraProgress).mul(expectedBlockTime).toNumber()

export const useEraEtaFormatter = () => {
  const api = useRecoilValue(apiState)
  const sessionProgressLoadable = useChainState('derive', 'session', 'progress', [])

  return sessionProgressLoadable.map(
    sessionProgress => (era: BN) =>
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
      )
  )
}
