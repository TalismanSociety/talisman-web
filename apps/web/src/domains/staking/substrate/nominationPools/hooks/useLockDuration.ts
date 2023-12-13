import { expectedBlockTime, expectedSessionTime, useSubstrateApiState } from '@domains/common'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { Maybe } from '@util/monads'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

export const useLocalizedLockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  const erasOrSessions = sessionProgress.eraLength.mul(api.consts.staking.bondingDuration)

  if (!sessionProgress.isEpoch) {
    return Maybe.of(expectedSessionTime(api)).mapOr(`${erasOrSessions.toString()} sessions`, sessionLength =>
      formatDistance(0, erasOrSessions.muln(sessionLength).toNumber())
    )
  }

  const ms = erasOrSessions.mul(expectedBlockTime(api))

  return formatDistance(0, ms.toNumber())
}
