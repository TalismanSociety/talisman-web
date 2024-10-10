import { selectedEvmAccountsState } from '../../../../domains/accounts'
import { useStakes, type LidoSuite } from '../../../../domains/staking/lido'
import { lidoSuitesState } from '../../../../domains/staking/lido/recoils'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import LidoWidgetSideSheet from './LidoWidgetSideSheet'
import StakePosition, { StakePositionErrorBoundary } from '@/components/recipes/StakePosition'
import { useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

const IncreaseStakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url={`https://stake.lido.fi?ref=${import.meta.env.REACT_APP_LIDO_REWARDS_ADDRESS}`}
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const UnstakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url={`https://stake.lido.fi/withdrawals/request?ref=${import.meta.env.REACT_APP_LIDO_REWARDS_ADDRESS}`}
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const ClaimSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url={`https://stake.lido.fi/withdrawals/claim?ref=${import.meta.env.REACT_APP_LIDO_REWARDS_ADDRESS}`}
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const LidoStakes = (props: {
  lidoSuite: LidoSuite
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [increaseStakeSideSheetOpen, setIncreaseStakeSideSheetOpen] = useState(false)
  const [unstakeSideSheetOpen, setUnstakeSideSheetOpen] = useState(false)
  const [claimSideSheetOpen, setClaimSideSheetOpen] = useState(false)

  const { data: stakes, isLoading } = useStakes(useRecoilValue(selectedEvmAccountsState), props.lidoSuite)

  if (stakes.length || !isLoading) {
    props.setShouldRenderLoadingSkeleton(false)
  }

  const logo = 'https://raw.githubusercontent.com/TalismanSociety/chaindata/main/assets/tokens/eth.svg'

  return (
    <>
      {stakes.map((stake, index) => {
        const symbol = stake.balance.options?.currency ?? ''
        return (
          <ErrorBoundary
            key={index}
            renderFallback={() => (
              <StakePositionErrorBoundary
                chain={props.lidoSuite.chain.name}
                assetSymbol={symbol}
                assetLogoSrc={logo}
                account={stake.account}
                provider="Lido finance"
                key={index}
              />
            )}
          >
            <StakePosition
              readonly={stake.account.readonly || !stake.account.canSignEvm}
              account={stake.account}
              provider="Lido finance"
              stakeStatus={stake.balance.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
              balance={<RedactableBalance>{stake.balance.toLocaleString()}</RedactableBalance>}
              fiatBalance={<AnimatedFiatNumber end={stake.fiatBalance} />}
              chain={props.lidoSuite.chain.name}
              chainId={props.lidoSuite.chain.id}
              assetSymbol={symbol}
              assetLogoSrc={logo}
              withdrawButton={
                stake.claimable.planck > 0n && (
                  <StakePosition.WithdrawButton
                    amount={<RedactableBalance>{stake.claimable.toLocaleString()}</RedactableBalance>}
                    onClick={() => setClaimSideSheetOpen(true)}
                  />
                )
              }
              increaseStakeButton={
                <StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeSideSheetOpen(true)} />
              }
              unstakeButton={
                stake.balance.planck > 0n && (
                  <StakePosition.UnstakeButton onClick={() => setUnstakeSideSheetOpen(true)} />
                )
              }
              unstakingStatus={
                stake.totalUnlocking.planck > 0n && (
                  <StakePosition.UnstakingStatus amount={stake.totalUnlocking.toLocaleString()} unlocks={[]} />
                )
              }
            />
          </ErrorBoundary>
        )
      })}
      {increaseStakeSideSheetOpen && (
        <IncreaseStakeSideSheet
          onRequestDismiss={() => setIncreaseStakeSideSheetOpen(false)}
          lidoSuite={props.lidoSuite}
        />
      )}
      {unstakeSideSheetOpen && (
        <UnstakeSideSheet onRequestDismiss={() => setUnstakeSideSheetOpen(false)} lidoSuite={props.lidoSuite} />
      )}
      {claimSideSheetOpen && (
        <ClaimSideSheet onRequestDismiss={() => setClaimSideSheetOpen(false)} lidoSuite={props.lidoSuite} />
      )}
    </>
  )
}

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const Stakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const lidoSuitesLoadable = useRecoilValueLoadable(lidoSuitesState)

  const lidoSuites = lidoSuitesLoadable.valueMaybe()

  return (
    <>
      {lidoSuites?.map((lidoSuite, index) => (
        <LidoStakes key={index} lidoSuite={lidoSuite} setShouldRenderLoadingSkeleton={setShouldRenderLoadingSkeleton} />
      ))}
    </>
  )
}

export default Stakes
