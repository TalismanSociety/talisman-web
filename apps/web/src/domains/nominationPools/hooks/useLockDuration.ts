import { expectedBlockTime, useChainDeriveState, useSubstrateApiState } from '@domains/common'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

export const useLocalizedLockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useChainDeriveState('session', 'progress', [])])
  )

  if (!sessionProgress.isEpoch) {
    return `${sessionProgress.eraLength.mul(api.consts.staking.bondingDuration).toString()} sessions`
  }

  const ms = sessionProgress.eraLength.mul(api.consts.staking.bondingDuration).mul(expectedBlockTime(api))

  return formatDistance(0, ms.toNumber())
}
