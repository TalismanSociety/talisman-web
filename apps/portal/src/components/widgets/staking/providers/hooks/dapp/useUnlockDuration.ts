import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

import { expectedBlockTime, useSubstrateApiState } from '@/domains/common'
import { useEraLengthState } from '@/domains/staking/dappStaking'

const useUnlockDuration = () => {
  const [api, { standardEraLength }] = useRecoilValue(waitForAll([useSubstrateApiState(), useEraLengthState()]))

  const unlockDuration = useMemo(
    () => api.consts.dappStaking.unlockingPeriod.muln(standardEraLength).mul(expectedBlockTime(api)),
    [api, standardEraLength]
  ).toNumber()

  return unlockDuration
}

export default useUnlockDuration
