import StakePosition from '@components/recipes/StakePosition'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { evmAccountsState } from '@domains/accounts'
import { lidoMainnet, useStakes, type LidoSuite } from '@domains/staking/lido'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import LidoWidgetSideSheet from './LidoWidgetSideSheet'

const IncreaseStakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url="https://stake.lido.fi?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const UnstakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url="https://stake.lido.fi/withdrawals/request?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const ClaimSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => (
  <LidoWidgetSideSheet
    url="https://stake.lido.fi/withdrawals/claim?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
    lidoSuite={props.lidoSuite}
    onRequestDismiss={props.onRequestDismiss}
  />
)

const Stakes = () => {
  const [increaseStakeSideSheetOpen, setIncreaseStakeSideSheetOpen] = useState(false)
  const [unstakeSideSheetOpen, setUnstakeSideSheetOpen] = useState(false)
  const [claimSideSheetOpen, setClaimSideSheetOpen] = useState(false)

  const stakes = useStakes(useRecoilValue(evmAccountsState), lidoMainnet)

  return (
    <>
      {stakes.map((stake, index) => (
        <StakePosition
          key={index}
          account={stake.account}
          provider="Lido finance"
          stakeStatus={stake.balance.planck.gtn(0) ? 'earning_rewards' : 'not_earning_rewards'}
          balance={<RedactableBalance>{stake.balance.toHuman()}</RedactableBalance>}
          fiatBalance={<AnimatedFiatNumber end={stake.fiatBalance} />}
          chain={lidoMainnet.chain.name}
          symbol={stake.balance.unit}
          claimButton={
            stake.claimable.planck.gtn(0) && (
              <StakePosition.ClaimButton
                amount={<RedactableBalance>{stake.claimable.toHuman()}</RedactableBalance>}
                onClick={() => setClaimSideSheetOpen(true)}
              />
            )
          }
          increaseStakeButton={
            <StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeSideSheetOpen(true)} />
          }
          unstakeButton={
            stake.balance.planck.gtn(0) && <StakePosition.UnstakeButton onClick={() => setUnstakeSideSheetOpen(true)} />
          }
          status={
            stake.totalUnlocking.planck.gtn(0) && (
              <StakePosition.UnstakingStatus amount={stake.totalUnlocking.toHuman()} unlocks={[]} />
            )
          }
        />
      ))}
      {increaseStakeSideSheetOpen && (
        <IncreaseStakeSideSheet onRequestDismiss={() => setIncreaseStakeSideSheetOpen(false)} lidoSuite={lidoMainnet} />
      )}
      {unstakeSideSheetOpen && (
        <UnstakeSideSheet onRequestDismiss={() => setUnstakeSideSheetOpen(false)} lidoSuite={lidoMainnet} />
      )}
      {claimSideSheetOpen && (
        <ClaimSideSheet onRequestDismiss={() => setClaimSideSheetOpen(false)} lidoSuite={lidoMainnet} />
      )}
    </>
  )
}

export default Stakes
