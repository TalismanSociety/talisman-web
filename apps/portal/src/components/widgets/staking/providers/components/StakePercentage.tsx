import { ChainProvider } from '@/domains/chains'
import { SlpxPair } from '@/domains/staking/slpx/types'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'

import PercentageBar from '../components/PercentageBar'
import useSlpxStakePercentage from '../hooks/bifrost/useSlpxStakePercentage'
import useSlpxSubstrateStakePercentage from '../hooks/bifrost/useSlpxSubstrateStakePercentage'
import useDappStakePercentage from '../hooks/dapp/useStakePercentage'
import useLidoStakePercentage from '../hooks/lido/useStakePercentage'
import useNominationPoolStakePercentage from '../hooks/nominationPools/useStakePercentage'
import useSubtensorStakePercentage from '../hooks/subtensor/useStakePercentage'
import { StakeProviderTypeId } from '../hooks/types'

type StakePercentageProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  setStakePercentage: (stakePercentage: number) => void
  tokenPair: SlpxPair | SlpxSubstratePair | undefined
  symbol?: string
  nativeTokenAddress?: `0x${string}` | string
  chainId?: string | number
}
type StakePercentageDisplayProps = Omit<StakePercentageProps, 'genesisHash'>

// This component is used to get around the react rules of conditional hooks
const StakePercentageDisplay = ({
  typeId,
  tokenPair,
  symbol,
  nativeTokenAddress,
  chainId,
  setStakePercentage,
}: StakePercentageDisplayProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolStakePercentage,
    liquidStakingSlpx: useSlpxStakePercentage,
    liquidStakingSlpxSubstrate: useSlpxSubstrateStakePercentage,
    delegationSubtensor: useSubtensorStakePercentage,
    dappStaking: useDappStakePercentage,
    liquidStakingLido: useLidoStakePercentage,
  }
  let stakeValue: number = 0
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
  setStakePercentage(stakeValue)

  return <PercentageBar percentage={stakeValue} />
}

const AvailableBalance = ({
  typeId,
  genesisHash,
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
