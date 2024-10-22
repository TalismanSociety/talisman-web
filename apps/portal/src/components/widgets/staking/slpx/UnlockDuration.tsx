import { useVTokenUnlockDuration, type SlpxPair } from '../../../../domains/staking/slpx'
import { formatDistance } from 'date-fns'
import { useMemo } from 'react'

export type UnlockDurationProps = { slpxPair: SlpxPair }

const UnlockDuration = (props: UnlockDurationProps) => {
  const unlockDuration = useVTokenUnlockDuration(props.slpxPair)
  return <>0-{useMemo(() => formatDistance(0, unlockDuration), [unlockDuration])}</>
}

export default UnlockDuration
