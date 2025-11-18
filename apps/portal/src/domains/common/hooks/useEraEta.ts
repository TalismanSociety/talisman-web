import BN from 'bn.js'
import { addMilliseconds, formatDistanceToNow } from 'date-fns'
import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { useChainState } from '@/domains/chains/hooks'
import { expectedBlockTime, expectedSessionTime } from '@/domains/common/utils/substratePolyfills'
import { useBabeApi } from '@/domains/staking/substrate/nominationPools/hooks/useBabeApi'
import { Maybe } from '@/util/monads'

import { chainDeriveState } from '../recoils/query'

const erasOrSessionsRemaining = (current: BN, length: BN, progress: BN) =>
  current.subn(1).mul(length).add(length).sub(progress)

export const useEraEtaFormatter = () => {
  const chain = useRecoilValue(useChainState())
  const chainId = useMemo(() => chain?.id, [chain])
  const currentChainEndpoint = chain.rpc

  const sessionProgressState = useMemo(() => {
    if (!currentChainEndpoint) return null
    return chainDeriveState(currentChainEndpoint, 'session', 'progress', [])
  }, [currentChainEndpoint])!

  const sessionProgress = useRecoilValue(sessionProgressState)
  const babeApi = useBabeApi(chainId)

  return useCallback(
    (erasOrSessions: BN | number) => {
      if (!babeApi) {
        console.error('❌ API is not ready for chain:', chainId)
        return 'Unknown'
      }

      const remaining = erasOrSessionsRemaining(
        new BN(erasOrSessions),
        sessionProgress.eraLength,
        sessionProgress.eraProgress
      )

      if (!sessionProgress.isEpoch) {
        return Maybe.of(babeApi)
          .map(expectedSessionTime)
          .mapOr(`${remaining.toString()} sessions`, sessionLength =>
            formatDistanceToNow(addMilliseconds(new Date(), remaining.mul(sessionLength).toNumber()))
          )
      }

      return formatDistanceToNow(addMilliseconds(new Date(), remaining.mul(expectedBlockTime(babeApi)).toNumber()))
    },
    [chainId, sessionProgress.eraLength, sessionProgress.eraProgress, sessionProgress.isEpoch, babeApi]
  )
}

export const useEraEta = (era: number) => useEraEtaFormatter()(era)
