import StakePosition from '../../../recipes/StakePosition'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import RedactableBalance from '../../RedactableBalance'
import { selectedEvmAccountsState } from '../../../../domains/accounts'
import { useStakes, type LidoSuite } from '../../../../domains/staking/lido'
import { lidoSuitesState } from '../../../../domains/staking/lido/recoils'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import LidoWidgetSideSheet from './LidoWidgetSideSheet'

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

const LidoStakes = (props: { lidoSuite: LidoSuite }) => {
  const [increaseStakeSideSheetOpen, setIncreaseStakeSideSheetOpen] = useState(false)
  const [unstakeSideSheetOpen, setUnstakeSideSheetOpen] = useState(false)
  const [claimSideSheetOpen, setClaimSideSheetOpen] = useState(false)

  const stakes = useStakes(useRecoilValue(selectedEvmAccountsState), props.lidoSuite)

  return (
    <>
      {stakes.map((stake, index) => (
        <StakePosition
          key={index}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          readonly={stake.account.readonly || !stake.account.canSignEvm}
          account={stake.account}
          provider="Lido finance"
          stakeStatus={stake.balance.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
          balance={<RedactableBalance>{stake.balance.toLocaleString()}</RedactableBalance>}
          fiatBalance={<AnimatedFiatNumber end={stake.fiatBalance} />}
          chain={props.lidoSuite.chain.name}
          symbol={stake.balance.options?.currency}
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
            stake.balance.planck > 0n && <StakePosition.UnstakeButton onClick={() => setUnstakeSideSheetOpen(true)} />
          }
          status={
            stake.totalUnlocking.planck > 0n && (
              <StakePosition.UnstakingStatus amount={stake.totalUnlocking.toLocaleString()} unlocks={[]} />
            )
          }
        />
      ))}
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

const Stakes = () => {
  const lidoSuites = useRecoilValue(lidoSuitesState)

  return (
    <>
      {lidoSuites.map((lidoSuite, index) => (
        <LidoStakes key={index} lidoSuite={lidoSuite} />
      ))}
    </>
  )
}

export default Stakes
