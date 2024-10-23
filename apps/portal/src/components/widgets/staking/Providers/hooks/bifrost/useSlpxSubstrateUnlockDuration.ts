import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useQueryState } from '@talismn/react-polkadot-api'
import { useRecoilValue } from 'recoil'

const useSlpxSubstrateUnlockDuration = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const unlockDuration = useRecoilValue(
    useQueryState('vtokenMinting', 'unlockDuration', [slpxPair.nativeToken.tokenId])
  )

  const rounds = unlockDuration.unwrapOrDefault().toHuman().Era
  const duration = rounds * slpxPair.estimatedRoundDuration

  return Number(duration)
}

export default useSlpxSubstrateUnlockDuration
