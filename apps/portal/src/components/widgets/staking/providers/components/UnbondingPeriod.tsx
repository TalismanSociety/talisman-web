import { Text } from '@talismn/ui/atoms/Text'
import { formatDistance } from 'date-fns'
import { useTranslation } from 'react-i18next'

import { ChainProvider } from '@/domains/chains/provider'
import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools/hooks/useUnlockDuration'

import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import useGetSeekStakeUnlockDuration from '../hooks/seek/useGetSeekStakeUnlockDuration'
import { StakeProviderTypeId } from '../hooks/types'

const unbondingFormatter = (unlockValue: number) => formatDistance(0, unlockValue)

type UnbondingPeriodProps = {
  typeId: StakeProviderTypeId
  genesisHash?: `0x${string}`
  setUnbondingValues: (unbonding: number) => void
  apiEndpoint?: string
}
type UnbondingDisplayProps = Omit<UnbondingPeriodProps, 'genesisHash'>

// This component is used to get around the react rules of conditional hooks
const UnbondingDisplay = ({ typeId, setUnbondingValues }: UnbondingDisplayProps) => {
  const { t } = useTranslation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolUnlockDuration,
    delegationSubtensor: () => 0,
    dappStaking: useDappUnlockDuration,
    liquidStakingLido: () => 5,
    seekStaking: useGetSeekStakeUnlockDuration,
  }

  let unlockValue: number = 0
  let label: string = ''
  switch (typeId) {
    case 'seekStaking':
      unlockValue = hookMap['seekStaking']()
      break
    case 'nominationPool':
      unlockValue = hookMap['nominationPool']()
      break
    case 'delegationSubtensor':
      unlockValue = hookMap['delegationSubtensor']()
      label = t('None')
      break
    case 'dappStaking':
      unlockValue = hookMap['dappStaking']()
      break
    case 'liquidStakingLido':
      unlockValue = hookMap['liquidStakingLido']()
      label = '1-5 day(s)'
      break
    default:
      unlockValue = 0
  }

  setUnbondingValues(unlockValue)

  return (
    <Text.BodySmall as="div" alpha="high">
      {label || unbondingFormatter(unlockValue)}
    </Text.BodySmall>
  )
}

const UnbondingPeriod = ({ typeId, genesisHash = '0x123', apiEndpoint, setUnbondingValues }: UnbondingPeriodProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <UnbondingDisplay typeId={typeId} setUnbondingValues={setUnbondingValues} apiEndpoint={apiEndpoint} />
    </ChainProvider>
  )
}

export default UnbondingPeriod
