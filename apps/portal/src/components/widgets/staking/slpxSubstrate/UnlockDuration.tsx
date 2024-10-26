import useSlpxSubstrateUnlockDuration from '@/components/widgets/staking/Providers/hooks/bifrost/useSlpxSubstrateUnlockDuration'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { formatDistance } from 'date-fns'

// TODO: Delete  UnlockDuration
const UnlockDuration = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const duration = useSlpxSubstrateUnlockDuration({ slpxPair })

  return <>0-{formatDistance(0, Number(duration))}</>
}

export default UnlockDuration
