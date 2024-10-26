import { formatDistance } from 'date-fns'

import useSlpxSubstrateUnlockDuration from '@/components/widgets/staking/providers/hooks/bifrost/useSlpxSubstrateUnlockDuration'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'

// TODO: Delete  UnlockDuration
const UnlockDuration = ({ slpxPair }: { slpxPair: SlpxSubstratePair }) => {
  const duration = useSlpxSubstrateUnlockDuration({ slpxPair })

  return <>0-{formatDistance(0, Number(duration))}</>
}

export default UnlockDuration
