import { useDeriveState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { useRecoilValue, waitForAll } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { expectedBlockTime, expectedSessionTime } from '@/domains/common/utils/substratePolyfills'
import { Maybe } from '@/util/monads'

import { getStakingBondingDurationMs } from '../utils/helpers'
import { useBabeApi } from './useBabeApi'

export const useLocalizedUnlockDuration = () => {
  const unlockDuration = useUnlockDuration()

  return formatDistance(0, unlockDuration)
}

const KUSAMA_ASSET_HUB_CHAIN_ID = 'kusama-asset-hub'

export const useUnlockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )
  const chain = useRecoilValue(useChainState())
  const isKusamaAssetHub = chain.id === KUSAMA_ASSET_HUB_CHAIN_ID

  const babeApi = useBabeApi(chain.id)

  if (isKusamaAssetHub) {
    const bondingDuration = getStakingBondingDurationMs({ stakingApi: api, babeApi: babeApi })

    return Number(bondingDuration.toString())
  }
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
