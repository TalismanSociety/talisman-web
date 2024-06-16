import { selectedEvmAccountsState } from '../../../../domains/accounts'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState } from '../../../../domains/staking/slpx'
import { useStakes } from '../../../../domains/staking/slpx/core'
import type { SlpxPair } from '../../../../domains/staking/slpx/types'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'
import { StakePosition } from '@talismn/ui-recipes'
import { StakePositionErrorBoundary } from '@talismn/ui-recipes'
import { useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

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
        balance={<RedactableBalance>{props.position.balance.toLocaleString()}</RedactableBalance>}
        fiatBalance={<AnimatedFiatNumber end={props.position.fiatBalance} />}
        chain={props.slpxPair.chain.name}
        assetSymbol={props.position.balance.options?.currency}
        assetLogoSrc={props.slpxPair.vToken.logo}
        increaseStakeButton={<StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />}
        unstakeButton={
          props.position.balance.planck > 0n && (
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          )
        }
        unstakingStatus={
          props.position.unlocking !== undefined &&
          props.position.unlocking.planck > 0n && (
            <StakePosition.UnstakingStatus amount={props.position.unlocking?.toLocaleString()} unlocks={[]} />
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
