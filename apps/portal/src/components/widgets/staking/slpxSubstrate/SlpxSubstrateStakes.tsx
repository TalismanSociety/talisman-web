import { ChainProvider } from '../../../../domains/chains'
import { slpxSubstratePairsState } from '../../../../domains/staking/slpxSubstrate/recoils'
import useStakes from '../../../../domains/staking/slpxSubstrate/useStakes'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import { SlpxSubstratePair } from '@/domains/staking/slpxSubstrate/types'
import { StakePosition } from '@talismn/ui-recipes'
import { StakePositionErrorBoundary } from '@talismn/ui-recipes'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

const SlpxSubstrateStake = ({
  slpxSubstratePair,
  setShouldRenderLoadingSkeleton,
}: {
  slpxSubstratePair: SlpxSubstratePair
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState<boolean>(false)
  const { stakes, isLoading } = useStakes({ slpxSubstratePair })

  if (!isLoading) {
    setShouldRenderLoadingSkeleton(false)
  }

  return stakes?.map((stake, index) => {
    return (
      <ErrorBoundary
        key={index}
        orientation="horizontal"
        renderFallback={() => (
          <StakePositionErrorBoundary
            chain={slpxSubstratePair.chainName}
            assetSymbol={slpxSubstratePair.vToken.symbol}
            assetLogoSrc={slpxSubstratePair.vToken.logo}
            account={stake.account}
            provider="Bifrost liquid staking"
          />
        )}
      >
        <StakePosition
          account={stake.account}
          readonly={stake.account.readonly}
          provider="Bifrost liquid staking"
          stakeStatus={stake.balance.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
          balance={<RedactableBalance>{stake.balance?.toLocaleString()}</RedactableBalance>}
          fiatBalance={<AnimatedFiatNumber end={stake.fiatBalance} />}
          chain={slpxSubstratePair.chainName}
          assetSymbol={slpxSubstratePair.vToken.symbol}
          assetLogoSrc={slpxSubstratePair.vToken.logo}
          increaseStakeButton={<StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />}
          // unstakeButton={
          //   props.position.balance.planck > 0n && (
          //     <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          //   )
          // }
          unstakingStatus={
            stake.unlocking !== undefined &&
            stake.unlocking.planck > 0n && (
              <StakePosition.UnstakingStatus amount={stake.unlocking?.toLocaleString()} unlocks={[]} />
            )
          }
        />
        {increaseStakeDialogOpen && (
          <AddStakeDialog
            account={stake.account}
            slpxSubstratePair={slpxSubstratePair}
            onRequestDismiss={() => setIncreaseStakeDialogOpen(false)}
          />
        )}
      </ErrorBoundary>
    )
  })
}

type SlpxSubstrateStakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const SlpxSubstrateStakes = ({ setShouldRenderLoadingSkeleton }: SlpxSubstrateStakesProps) => {
  const slpxSubstratePairs = useAtomValue(slpxSubstratePairsState)

  return (
    <>
      {slpxSubstratePairs?.map((slpxSubstratePair, index) => (
        <ChainProvider
          key={index}
          chain={{
            genesisHash: slpxSubstratePair.substrateChainGenesisHash,
          }}
        >
          <SlpxSubstrateStake
            slpxSubstratePair={slpxSubstratePair}
            setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton}
          />
        </ChainProvider>
      ))}
    </>
  )
}

export default SlpxSubstrateStakes
