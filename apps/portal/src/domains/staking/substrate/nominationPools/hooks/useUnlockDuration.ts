import { useDeriveState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/recoils/api'
import { expectedBlockTime, expectedSessionTime } from '@/domains/common/utils/substratePolyfills'
import { Maybe } from '@/util/monads'

export const useLocalizedUnlockDuration = () => {
  const unlockDuration = useUnlockDuration()

  return formatDistance(0, unlockDuration)
}

export const useUnlockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  const erasOrSessions = sessionProgress.eraLength.mul(api.consts.staking.bondingDuration)

  if (!sessionProgress.isEpoch) {
    return Number(
      Maybe.of(expectedSessionTime(api)).mapOr(`${erasOrSessions.toString()} sessions`, sessionLength =>
        erasOrSessions.mul(sessionLength).toString()
      )
    )
  }

  const ms = erasOrSessions.mul(expectedBlockTime(api))

  return ms.toNumber()
}
