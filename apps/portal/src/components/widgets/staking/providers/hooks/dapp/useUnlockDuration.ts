import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { useSubstrateApiState } from '@/domains/common/recoils/api'
import { expectedBlockTime } from '@/domains/common/utils/substratePolyfills'
import { useEraLengthState } from '@/domains/staking/dappStaking/recoils'

const useUnlockDuration = () => {
  const [api, { standardEraLength }] = useRecoilValue(waitForAll([useSubstrateApiState(), useEraLengthState()]))

  const unlockDuration = useMemo(
    () => api.consts.dappStaking.unlockingPeriod.muln(standardEraLength).mul(expectedBlockTime(api)),
    [api, standardEraLength]
  ).toNumber()

  return unlockDuration
}

export default useUnlockDuration
