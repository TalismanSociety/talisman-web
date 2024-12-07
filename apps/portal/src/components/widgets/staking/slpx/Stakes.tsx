import { useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import StakePosition, { StakePositionErrorBoundary } from '@/components/recipes/StakePosition'

import type { SlpxPair } from '../../../../domains/staking/slpx/types'
import { selectedEvmAccountsState } from '../../../../domains/accounts'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState } from '../../../../domains/staking/slpx'
import { useStakes } from '../../../../domains/staking/slpx/core'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const Stake = (props: { slpxPair: SlpxPair; position: ReturnType<typeof useStakes>['data'][number] }) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  return (
    <ErrorBoundary
      orientation="horizontal"
      renderFallback={() => (
        <StakePositionErrorBoundary
          chain={props.slpxPair.chain.name}
          assetSymbol={props.position.balance.options?.currency}
          assetLogoSrc={props.slpxPair.vToken.logo}
          account={props.position.account}
          provider="Bifrost liquid staking"
        />
      )}
    >
      <StakePosition
        readonly={props.position.account.readonly || !props.position.account.canSignEvm}
        account={props.position.account}
        provider="Bifrost liquid staking"
        stakeStatus={props.position.balance.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <RedactableBalance>{props.position.balance.toLocaleString()}</RedactableBalance>
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <AnimatedFiatNumber end={props.position.fiatBalance} />
          </ErrorBoundary>
        }
        chain={props.slpxPair.chain.name}
        chainId={props.slpxPair.chain.id}
        assetSymbol={props.position.balance.options?.currency}
        assetLogoSrc={props.slpxPair.vToken.logo}
        increaseStakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />
          </ErrorBoundary>
        }
        unstakeButton={
          props.position.balance.planck > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
            </ErrorBoundary>
          )
        }
        unstakingStatus={
          props.position.unlocking !== undefined &&
          props.position.unlocking.planck > 0n && (
            <ErrorBoundary renderFallback={() => <>--</>}>
              <StakePosition.UnstakingStatus amount={props.position.unlocking?.toLocaleString()} unlocks={[]} />
            </ErrorBoundary>
          )
        }
      />
      {increaseStakeDialogOpen && (
        <AddStakeDialog
          slpxPair={props.slpxPair}
          account={props.position.account}
          onRequestDismiss={() => setIncreaseStakeDialogOpen(false)}
        />
      )}
      {unstakeDialogOpen && (
        <UnstakeDialog
          slpxPair={props.slpxPair}
          account={props.position.account}
          onRequestDismiss={() => setUnstakeDialogOpen(false)}
        />
      )}
    </ErrorBoundary>
  )
}

const SlpxStakes = (props: {
  slpxPair: SlpxPair
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { data: stakes, isLoading } = useStakes(useRecoilValue(selectedEvmAccountsState), props.slpxPair)

  if (!isLoading) {
    props.setShouldRenderLoadingSkeleton(false)
  }

  return (
    <>
      {stakes?.map((x, index) => (
        <Stake key={index} slpxPair={props.slpxPair} position={x} />
      ))}
    </>
  )
}

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const Stakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const slpxPairsLoadable = useRecoilValueLoadable(slpxPairsState)
  const slpxPairs = slpxPairsLoadable.valueMaybe()

  return (
    <>
      {slpxPairs?.map((slpxPair, index) => (
        <ChainProvider
          key={index}
          chain={{
            genesisHash: slpxPair.substrateChainGenesisHash,
          }}
        >
          <SlpxStakes slpxPair={slpxPair} setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
        </ChainProvider>
      ))}
    </>
  )
}

export default Stakes
