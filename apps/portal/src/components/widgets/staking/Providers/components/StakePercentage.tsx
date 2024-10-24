import { useAvailableBalance as useSlpxAvailableBalance } from '../hooks/bifrost/useAvailableBalance'
import useLidoAvailableBalance from '../hooks/lido/useAvailableBalance'
import useAvailableBalance from '../hooks/useAvailableBalance'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import AnimatedFiatNumber from '@/components/widgets/AnimatedFiatNumber'
import { ChainProvider } from '@/domains/chains'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { Decimal } from '@talismn/math'
import { useEffect, useMemo } from 'react'

type StakePercentageProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setStakePercentage: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  availableBalance: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
}
type StakePercentageDisplayProps = Omit<StakePercentageProps, 'genesisHash'>
type LidoStakePercentageProps = Omit<StakePercentageDisplayProps, 'genesisHash' | 'typeId' | 'tokenPair'>

/**
 * This is a custom hook that is used to set the availableBalance value in the state.
 * It is used to keep track of the availableBalance value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the availableBalance values
 */
const useSetAvailableBalance = ({
  stakeValue,
  rowId,
  availableBalance,
  setStakePercentage,
}: {
  stakeValue: number | undefined
  rowId: string
  availableBalance: number | undefined
  setStakePercentage: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (availableBalance !== stakeValue && stakeValue !== undefined) {
      setStakePercentage(prev => ({ ...prev, [rowId]: stakeValue }))
    }
  }, [availableBalance, stakeValue, rowId, setStakePercentage])

  return stakeValue
}

type AvailableBalance = {
  availableBalance: Decimal
  fiatAmount: number
}
type hookMapKey = 'substrate' | 'slpx'

// This component is used to get around the react rules of conditional hooks
const AvailableBalanceDisplay = ({
  typeId,
  rowId,
  availableBalance,
  tokenPair,
  setStakePercentage,
}: StakePercentageDisplayProps) => {
  const hookMap: Record<hookMapKey, (arg0?: any, arg1?: boolean) => AvailableBalance> = {
    substrate: useAvailableBalance,
    slpx: useSlpxAvailableBalance,
  }
  let stakeValue: AvailableBalance
  switch (typeId) {
    case 'nominationPool':
    case 'delegationSubtensor':
    case 'dappStaking':
      stakeValue = hookMap['substrate']()
      break
    case 'liquidStakingSlpx':
    case 'liquidStakingSlpxSubstrate':
      stakeValue = hookMap['slpx'](tokenPair, tokenPair?.nativeToken.symbol === 'DOT')
      break
    default:
      stakeValue = {
        availableBalance: Decimal.fromPlanck(0n, 0),
        fiatAmount: 0,
      }
  }

  useSetAvailableBalance({
    stakeValue: stakeValue.fiatAmount,
    rowId,
    availableBalance,
    setStakePercentage,
  })

  return (
    <div>
      <div>{stakeValue.availableBalance.toLocaleString()}</div>
      <AnimatedFiatNumber end={useMemo(() => stakeValue.fiatAmount ?? 0, [stakeValue.fiatAmount])} />
    </div>
  )
}

const LidoAvailableBalance = ({ rowId, setStakePercentage, availableBalance, symbol }: LidoStakePercentageProps) => {
  const stakeValue = useLidoAvailableBalance(symbol ?? '')

  useSetAvailableBalance({
    stakeValue: stakeValue.fiatAmount,
    rowId,
    availableBalance,
    setStakePercentage,
  })

  return (
    <div>
      <div>{stakeValue.availableBalance.toLocaleString()}</div>
      <AnimatedFiatNumber end={useMemo(() => stakeValue.fiatAmount ?? 0, [stakeValue.fiatAmount])} />
    </div>
  )
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  availableBalance,
  apiEndpoint,
  setStakePercentage,
  tokenPair,
  symbol,
}: StakePercentageProps) => {
  if (typeId === 'liquidStakingLido') {
    return (
      <LidoAvailableBalance
        rowId={rowId}
        availableBalance={availableBalance}
        setStakePercentage={setStakePercentage}
        apiEndpoint={apiEndpoint}
        symbol={symbol}
      />
    )
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <AvailableBalanceDisplay
        typeId={typeId}
        rowId={rowId}
        availableBalance={availableBalance}
        setStakePercentage={setStakePercentage}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
