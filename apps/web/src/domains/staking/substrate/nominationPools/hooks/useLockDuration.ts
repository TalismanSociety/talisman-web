import { expectedBlockTime, useSubstrateApiState } from '@domains/common'
import { useDeriveState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

export const useLocalizedLockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )

  if (!sessionProgress.isEpoch) {
    return `${sessionProgress.eraLength.mul(api.consts.staking.bondingDuration).toString()} sessions`
  }

  const ms = sessionProgress.eraLength.mul(api.consts.staking.bondingDuration).mul(expectedBlockTime(api))

  return formatDistance(0, ms.toNumber())
}
