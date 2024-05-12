import { Maybe } from '../../../../../util/monads'
import { expectedBlockTime, expectedSessionTime, useSubstrateApiState } from '../../../../common'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

export const useLocalizedUnlockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  const erasOrSessions = sessionProgress.eraLength.mul(api.consts.staking.bondingDuration)

  if (!sessionProgress.isEpoch) {
    return Maybe.of(expectedSessionTime(api)).mapOr(`${erasOrSessions.toString()} sessions`, sessionLength =>
      formatDistance(0, erasOrSessions.mul(sessionLength).toNumber())
    )
  }

  const ms = erasOrSessions.mul(expectedBlockTime(api))

  return formatDistance(0, ms.toNumber())
}
