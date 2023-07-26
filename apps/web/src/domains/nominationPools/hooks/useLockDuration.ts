import { useChainDeriveState, useSubstrateApiState } from '@domains/common'
import { useMemo } from 'react'
import { useRecoilValueLoadable, waitForAll } from 'recoil'

export const useLockDuration = () => {
  const loadable = useRecoilValueLoadable(
    waitForAll([useSubstrateApiState(), useChainDeriveState('session', 'eraLength', [])])
  )

  return useMemo(() => {
    if (loadable.state !== 'hasValue') {
      return undefined
    }
    const [api, eraLength] = loadable.contents

    return eraLength.mul(api.consts.staking.bondingDuration).mul(api.consts.babe.expectedBlockTime)
  }, [loadable.contents, loadable.state])
}
