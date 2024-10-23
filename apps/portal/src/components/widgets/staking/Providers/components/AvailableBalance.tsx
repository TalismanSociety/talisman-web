// import useSlpxSubstrateUnlockDuration from '../hooks/bifrost/useSlpxSubstrateUnlockDuration'
// import useDappUnlockDuration from '../hooks/dapp/useUnlockDuration'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
// import { useVTokenUnlockDuration } from '@/domains/staking/slpx'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
// import { useUnlockDuration as useNominationPoolUnlockDuration } from '@/domains/staking/substrate/nominationPools'
import { formatDistance } from 'date-fns'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const availableBalanceFormatter = (balanceValue: number) => formatDistance(0, balanceValue)

type AvailableBalanceProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setAvailableBalanceValue: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  availableBalance: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
}
type AvailableBalanceDisplayProps = Omit<AvailableBalanceProps, 'genesisHash'>
type LidoAvailableBalanceProps = Omit<
  AvailableBalanceDisplayProps,
  'symbol' | 'symbol' | 'genesisHash' | 'typeId' | 'tokenPair'
>

/**
 * This is a custom hook that is used to set the availableBalance value in the state.
 * It is used to keep track of the availableBalance value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the availableBalance values
 */
const useSetAvailableBalance = ({
  balanceValue,
  rowId,
  availableBalance,
  setAvailableBalanceValue,
}: {
  balanceValue: number | undefined
  rowId: string
  availableBalance: number | undefined
  setAvailableBalanceValue: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (availableBalance !== balanceValue && balanceValue !== undefined) {
      setAvailableBalanceValue(prev => ({ ...prev, [rowId]: balanceValue }))
    }
  }, [availableBalance, balanceValue, rowId, setAvailableBalanceValue])

  return balanceValue
}

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({
  typeId,
  rowId,
  availableBalance,
  // tokenPair,
  setAvailableBalanceValue,
}: AvailableBalanceDisplayProps) => {
  const { t } = useTranslation()

  // @ts-expect-error
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: () => 0,
    // liquidStakingSlpx: useVTokenUnlockDuration,
    // liquidStakingSlpxSubstrate: useSlpxSubstrateUnlockDuration,
    // delegationSubtensor: () => 0,
    // dappStaking: useDappUnlockDuration,
    // liquidStakingLido: () => 0,
  }

  let balanceValue: number = 0
  switch (typeId) {
    case 'nominationPool':
      balanceValue = hookMap['nominationPool']()
      break
    // case 'liquidStakingSlpx':
    //   balanceValue = hookMap['liquidStakingSlpx'](tokenPair)
    //   break
    // case 'liquidStakingSlpxSubstrate':
    //   balanceValue = hookMap['liquidStakingSlpxSubstrate']({ slpxPair: tokenPair })
    //   break
    // case 'delegationSubtensor':
    //   balanceValue = hookMap['delegationSubtensor']()
    //   break
    // case 'dappStaking':
    //   balanceValue = hookMap['dappStaking']()
    //   break
    default:
      balanceValue = 9999
  }

  useSetAvailableBalance({ balanceValue, rowId, availableBalance, setAvailableBalanceValue })

  return <>{balanceValue === 0 ? t('None') : availableBalanceFormatter(balanceValue)}</>
}

const LidoAvailableBalance = ({ rowId, setAvailableBalanceValue, availableBalance }: LidoAvailableBalanceProps) => {
  const balanceValue = 5

  useSetAvailableBalance({ balanceValue, rowId, availableBalance, setAvailableBalanceValue })

  return <>1-5 day(s)</>
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  availableBalance,
  apiEndpoint,
  setAvailableBalanceValue,
  tokenPair,
}: AvailableBalanceProps) => {
  if (typeId === 'liquidStakingLido') {
    return (
      <LidoAvailableBalance
        rowId={rowId}
        availableBalance={availableBalance}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
      />
    )
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        rowId={rowId}
        availableBalance={availableBalance}
        setAvailableBalanceValue={setAvailableBalanceValue}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
