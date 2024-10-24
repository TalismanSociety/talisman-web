// import { useAvailableBalance as useSlpxAvailableBalance } from '../hooks/bifrost/useAvailableBalance'
// import useLidoStakePercentage from '../hooks/lido/useAvailableBalance'
// import useAvailableBalance from '../hooks/useAvailableBalance'
import PercentageBar from '../components/PercentageBar'
// import { Decimal } from '@talismn/math'
import useSlpxStakePercentage from '../hooks/bifrost/useSlpxStakePercentage'
import useNominationPoolStakePercentage from '../hooks/nominationPools/useStakePercentage'
import { StakeProviderTypeId } from '../hooks/useProvidersData'
import { ChainProvider } from '@/domains/chains'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { useEffect } from 'react'

type StakePercentageProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  rowId: string
  setStakePercentage: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  stakePercentage: number | undefined
  apiEndpoint?: string
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
}
type StakePercentageDisplayProps = Omit<StakePercentageProps, 'genesisHash'>
type LidoStakePercentageProps = Omit<StakePercentageDisplayProps, 'genesisHash' | 'typeId' | 'tokenPair'>

/**
 * This is a custom hook that is used to set the stakePercentage value in the state.
 * It is used to keep track of the stakePercentage value for each row that is rendered after the table is mounted,
 * and is used to allow sorting of the table rows by the stakePercentage values
 */
const useSetAvailableBalance = ({
  stakeValue,
  rowId,
  stakePercentage,
  setStakePercentage,
}: {
  stakeValue: number | undefined
  rowId: string
  stakePercentage: number | undefined
  setStakePercentage: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
}) => {
  useEffect(() => {
    if (stakePercentage !== stakeValue && stakeValue !== undefined) {
      setStakePercentage(prev => ({ ...prev, [rowId]: stakeValue }))
    }
  }, [stakePercentage, stakeValue, rowId, setStakePercentage])

  return stakeValue
}

// This component is used to get around the react rules of conditional hooks
const StakePercentageDisplay = ({
  typeId,
  rowId,
  stakePercentage,
  tokenPair,
  setStakePercentage,
}: StakePercentageDisplayProps) => {
  // @ts-expect-error
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolStakePercentage,
    liquidStakingSlpx: useSlpxStakePercentage,
    // slpx: () => 999,
  }
  let stakeValue: number = 321
  switch (typeId) {
    case 'nominationPool':
      // case 'delegationSubtensor':
      // case 'dappStaking':
      stakeValue = hookMap['nominationPool']()
      break
    case 'liquidStakingSlpx':
      stakeValue = hookMap['liquidStakingSlpx'](tokenPair)
      break
    // case 'liquidStakingSlpxSubstrate':
    //   stakeValue = hookMap['slpx']()
    //   break
    default:
      stakeValue = 123
  }

  useSetAvailableBalance({
    stakeValue: stakeValue,
    rowId,
    stakePercentage,
    setStakePercentage,
  })

  // return <div>{stakeValue}</div>

  return <PercentageBar percentage={stakeValue} />
}

const LidoStakePercentage = ({ rowId, setStakePercentage, stakePercentage }: LidoStakePercentageProps) => {
  const stakeValue = 123

  useSetAvailableBalance({
    stakeValue: stakeValue,
    rowId,
    stakePercentage,
    setStakePercentage,
  })

  return <div>{stakeValue}</div>
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  stakePercentage,
  apiEndpoint,
  setStakePercentage,
  tokenPair,
  symbol,
}: StakePercentageProps) => {
  if (typeId === 'liquidStakingLido') {
    return (
      <LidoStakePercentage
        rowId={rowId}
        stakePercentage={stakePercentage}
        setStakePercentage={setStakePercentage}
        apiEndpoint={apiEndpoint}
        symbol={symbol}
      />
    )
  }

  return (
    <ChainProvider chain={{ genesisHash }}>
      <StakePercentageDisplay
        typeId={typeId}
        rowId={rowId}
        stakePercentage={stakePercentage}
        setStakePercentage={setStakePercentage}
        apiEndpoint={apiEndpoint}
        tokenPair={tokenPair}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
