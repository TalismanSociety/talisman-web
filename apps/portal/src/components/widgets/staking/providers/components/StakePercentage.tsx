import { ChainProvider } from '@/domains/chains/provider'

import PercentageBar from '../components/PercentageBar'
import useDappStakePercentage from '../hooks/dapp/useStakePercentage'
import useLidoStakePercentage from '../hooks/lido/useStakePercentage'
import useNominationPoolStakePercentage from '../hooks/nominationPools/useStakePercentage'
import useGetSeekStakePercentage from '../hooks/seek/useGetSeekStakePercentage'
import useSubtensorStakePercentage from '../hooks/subtensor/useStakePercentage'
import { StakeProviderTypeId } from '../hooks/types'

type StakePercentageProps = {
  typeId: StakeProviderTypeId
  genesisHash: `0x${string}`
  setStakePercentage: (stakePercentage: number) => void
  symbol?: string
  nativeTokenAddress?: `0x${string}` | string
  chainId?: string | number
  hasDTaoStaking?: boolean
}
type StakePercentageDisplayProps = Omit<StakePercentageProps, 'genesisHash'>

// This component is used to get around the react rules of conditional hooks
const StakePercentageDisplay = ({
  typeId,
  symbol,
  nativeTokenAddress,
  chainId,
  hasDTaoStaking,
  setStakePercentage,
}: StakePercentageDisplayProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hookMap: Record<StakeProviderTypeId, (arg0?: any) => number> = {
    nominationPool: useNominationPoolStakePercentage,
    delegationSubtensor: useSubtensorStakePercentage,
    dappStaking: useDappStakePercentage,
    liquidStakingLido: useLidoStakePercentage,
    seekStaking: useGetSeekStakePercentage,
  }
  let stakeValue: number = 0
  switch (typeId) {
    case 'seekStaking':
      stakeValue = hookMap['seekStaking']()
      break
    case 'nominationPool':
      stakeValue = hookMap['nominationPool']()
      break
    case 'delegationSubtensor':
      stakeValue = hookMap['delegationSubtensor'](hasDTaoStaking)
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
  symbol,
  nativeTokenAddress,
  chainId,
  hasDTaoStaking,
}: StakePercentageProps) => {
  return (
    <ChainProvider chain={{ genesisHash }}>
      <StakePercentageDisplay
        typeId={typeId}
        setStakePercentage={setStakePercentage}
        symbol={symbol}
        nativeTokenAddress={nativeTokenAddress}
        chainId={chainId}
        hasDTaoStaking={hasDTaoStaking}
      />
    </ChainProvider>
  )
}

export default AvailableBalance
