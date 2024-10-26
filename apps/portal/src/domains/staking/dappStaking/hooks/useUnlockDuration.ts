import { formatDistance } from 'date-fns'

import useUnlockDuration from '@/components/widgets/staking/providers/hooks/dapp/useUnlockDuration'

// TODO: Delete this hook
export const useLocalizedUnlockDuration = () => {
  const unlockDuration = useUnlockDuration()

  return formatDistance(0, unlockDuration)
}
