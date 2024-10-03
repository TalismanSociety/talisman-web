import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useQueryState } from '@talismn/react-polkadot-api'
import { formatDistance } from 'date-fns'
import { useRecoilValue } from 'recoil'

const UnlockDuration = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const unlockDuration = useRecoilValue(
    useQueryState('vtokenMinting', 'unlockDuration', [slpxPair.nativeToken.tokenId])
  )

  const rounds = unlockDuration.unwrapOrDefault().toHuman().Era
  const duration = rounds * slpxPair.estimatedRoundDuration

  return <>{formatDistance(0, Number(duration))}</>
}

export default UnlockDuration
