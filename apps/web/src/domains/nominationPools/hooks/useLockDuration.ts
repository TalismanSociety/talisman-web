import { apiState } from '@domains/chains/recoils'
import { useChainState } from '@domains/common/hooks'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'

export const useLockDuration = () => {
  const api = useRecoilValue(apiState)
  const expectedEraTimeLoadable = useChainState('derive', 'session', 'eraLength', [])

  return useMemo(
    () =>
      expectedEraTimeLoadable
        .valueMaybe()
        ?.mul(api.consts.staking.bondingDuration)
        .mul(api.consts.babe.expectedBlockTime),
    [api.consts.babe.expectedBlockTime, api.consts.staking.bondingDuration, expectedEraTimeLoadable]
  )
}
