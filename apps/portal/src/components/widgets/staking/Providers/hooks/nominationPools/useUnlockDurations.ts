import { substrateApiState } from '@/domains/common'
import { chainDeriveState } from '@/domains/common'
import { expectedBlockTime, expectedSessionTime } from '@/domains/common'
import { Maybe } from '@/util/monads'
import BN from 'bn.js'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

const useUnlockDurations = ({ rpcIds }: { rpcIds: string[] }) => {
  const apis = useRecoilValue(waitForAll(rpcIds.map(apiId => substrateApiState(apiId))))

  const sessionProgress = useRecoilValue(
    waitForAll(rpcIds.map(apiId => chainDeriveState(apiId, 'session', 'progress', [])))
  )

  const erasOrSessions = apis.map(
    (api, index) => sessionProgress[index]?.eraLength.mul(api.consts.staking.bondingDuration) ?? 0
  )

  const unlockDurations = erasOrSessions.map((erasOrSessions, index) => {
    if (!sessionProgress[index]?.isEpoch) {
      return Maybe.of(expectedSessionTime(apis[index]!)).mapOr(
        `${erasOrSessions.toString()} sessions`,
        sessionLength => {
          const erasOrSessionsBN = erasOrSessions as BN // Ensure erasOrSessions is of type BN
          return formatDistance(0, erasOrSessionsBN.mul(sessionLength).toNumber())
        }
      )
    }

    const ms = (erasOrSessions as BN).mul(expectedBlockTime(apis[index]!))

    return formatDistance(0, ms.toNumber())
  })

  return unlockDurations
}

export default useUnlockDurations
