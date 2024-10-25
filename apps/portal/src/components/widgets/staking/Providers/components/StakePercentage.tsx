import PercentageBar from '../components/PercentageBar'
import useSlpxStakePercentage from '../hooks/bifrost/useSlpxStakePercentage'
import useSlpxSubstrateStakePercentage from '../hooks/bifrost/useSlpxSubstrateStakePercentage'
import useDappStakePercentage from '../hooks/dapp/useStakePercentage'
import useLidoStakePercentage from '../hooks/lido/useStakePercentage'
import useNominationPoolStakePercentage from '../hooks/nominationPools/useStakePercentage'
import useSubtensorStakePercentage from '../hooks/subtensor/useStakePercentage'
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
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
  nativeTokenAddress?: `0x${string}` | string
  chainId?: string | number
}
type StakePercentageDisplayProps = Omit<StakePercentageProps, 'genesisHash'>

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
  symbol,
  nativeTokenAddress,
  chainId,
  setStakePercentage,
}: StakePercentageDisplayProps) => {
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolStakePercentage,
    liquidStakingSlpx: useSlpxStakePercentage,
    liquidStakingSlpxSubstrate: useSlpxSubstrateStakePercentage,
    delegationSubtensor: useSubtensorStakePercentage,
    dappStaking: useDappStakePercentage,
    liquidStakingLido: useLidoStakePercentage,
  }
  let stakeValue: number
  switch (typeId) {
    case 'nominationPool':
      stakeValue = hookMap['nominationPool']()
      break
    case 'liquidStakingSlpx':
      stakeValue = hookMap['liquidStakingSlpx'](tokenPair)
      break
    case 'liquidStakingSlpxSubstrate':
      stakeValue = hookMap['liquidStakingSlpxSubstrate'](tokenPair)
      break
    case 'delegationSubtensor':
      stakeValue = hookMap['delegationSubtensor']()
      break
    case 'dappStaking':
      stakeValue = hookMap['dappStaking']()
      break
    case 'liquidStakingLido':
      stakeValue = hookMap['liquidStakingLido']({
        symbol: symbol ?? '',
        nativeTokenAddress: (nativeTokenAddress as `0x${string}`) ?? '0x',
        chainId: chainId ?? 0,
      })
      break
    default:
      stakeValue = 0
  }

  useSetAvailableBalance({
    stakeValue: stakeValue,
    rowId,
    stakePercentage,
    setStakePercentage,
  })

  return <PercentageBar percentage={stakeValue} />
}

const AvailableBalance = ({
  typeId,
  genesisHash,
  rowId,
  stakePercentage,
  setStakePercentage,
  tokenPair,
  symbol,
  nativeTokenAddress,
  chainId,
}: StakePercentageProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <StakePercentageDisplay
        typeId={typeId}
        rowId={rowId}
        stakePercentage={stakePercentage}
        setStakePercentage={setStakePercentage}
        tokenPair={tokenPair}
        symbol={symbol}
        nativeTokenAddress={nativeTokenAddress}
        chainId={chainId}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
