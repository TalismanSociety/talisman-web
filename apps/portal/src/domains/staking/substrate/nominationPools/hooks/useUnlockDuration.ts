import { useDeriveState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { constSelector, useRecoilValue, waitForAll } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { useSubstrateApiState } from '@/domains/common/hooks/useSubstrateApiState'
import { expectedBlockTime, expectedSessionTime } from '@/domains/common/utils/substratePolyfills'
import { Maybe } from '@/util/monads'

import { areNominatorsSlashableState } from '../recoils'
import { getNominatorBondingDurationEras, getStakingBondingDurationMs } from '../utils/helpers'
import { useBabeApi } from './useBabeApi'

export const useLocalizedUnlockDuration = () => {
  const unlockDuration = useUnlockDuration()

  return formatDistance(0, unlockDuration)
}

const KUSAMA_ASSET_HUB_CHAIN_ID = 'kusama-asset-hub'
const POLKADOT_ASSET_HUB_CHAIN_ID = 'polkadot-asset-hub'

export const useUnlockDuration = () => {
  const [api, sessionProgress] = useRecoilValue(
    waitForAll([useSubstrateApiState(), useDeriveState('session', 'progress', [])])
  )
  const chain = useRecoilValue(useChainState())
  const isAssetHub = chain.id === KUSAMA_ASSET_HUB_CHAIN_ID || chain.id === POLKADOT_ASSET_HUB_CHAIN_ID

  const babeApi = useBabeApi(chain.id)

  // Only relevant when the fast-unbond constant exists; otherwise skip the storage read entirely.
  const hasFastUnbondDuration =
    (api.consts.staking as unknown as Record<string, unknown>)['nominatorFastUnbondDuration'] !== undefined
  const areNominatorsSlashable = useRecoilValue(
    hasFastUnbondDuration ? areNominatorsSlashableState(chain.rpc) : constSelector(true)
  )

  if (isAssetHub) {
    const bondingDuration = getStakingBondingDurationMs({ stakingApi: api, babeApi, areNominatorsSlashable })

    return Number(bondingDuration.toString())
  }
  const erasOrSessions = sessionProgress.eraLength.muln(getNominatorBondingDurationEras(api, areNominatorsSlashable))

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
