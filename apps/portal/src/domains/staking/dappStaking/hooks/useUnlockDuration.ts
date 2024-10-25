import useUnlockDuration from '@/components/widgets/staking/Providers/hooks/dapp/useUnlockDuration'
import { formatDistance } from 'date-fns'

// TODO: Delete this hook
export const useLocalizedUnlockDuration = () => {
  const unlockDuration = useUnlockDuration()

  return formatDistance(0, unlockDuration)
}
