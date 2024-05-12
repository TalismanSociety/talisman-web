import { expectedBlockTime, useSubstrateApiState } from '../../../common'
import { formatDistance } from 'date-fns'
import { useMemo } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'
import { useEraLengthState } from '..'

export const useLocalizedUnlockDuration = () => {
  const [api, { standardEraLength }] = useRecoilValue(waitForAll([useSubstrateApiState(), useEraLengthState()]))

  const ms = useMemo(
    () => api.consts.dappStaking.unlockingPeriod.muln(standardEraLength).mul(expectedBlockTime(api)),
    [api, standardEraLength]
  )

  return formatDistance(0, ms.toNumber())
}
