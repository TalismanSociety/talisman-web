import StakePosition from '@components/recipes/StakePosition'
import RedactableBalance from '@components/widgets/RedactableBalance'
import { evmAccountsState } from '@domains/accounts'
import { lidoMainnet, useStakes, type LidoSuite } from '@domains/staking/lido'
import { SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR, SideSheet } from '@talismn/ui'
import { useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { useSwitchNetwork } from 'wagmi'

const IncreaseStakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => {
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    switchNetwork?.(props.lidoSuite.chain.id)
  }, [props.lidoSuite.chain.id, switchNetwork])

  return (
    <SideSheet
      title="Lido staking"
      onRequestDismiss={props.onRequestDismiss}
      css={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { padding: 0 },
      }}
    >
      <iframe
        src="https://stake.lido.fi?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
        title="Lido Staking App"
        css={{ flex: 1, border: 'none', width: '100%', [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' } }}
      />
    </SideSheet>
  )
}

const UnstakeSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => {
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    switchNetwork?.(props.lidoSuite.chain.id)
  }, [props.lidoSuite.chain.id, switchNetwork])

  return (
    <SideSheet
      title="Lido staking"
      onRequestDismiss={props.onRequestDismiss}
      css={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { padding: 0 },
      }}
    >
      <iframe
        src="https://stake.lido.fi/withdrawals/request?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
        title="Lido Staking App"
        css={{ flex: 1, border: 'none', width: '100%', [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' } }}
      />
    </SideSheet>
  )
}

const ClaimSideSheet = (props: { onRequestDismiss: () => unknown; lidoSuite: LidoSuite }) => {
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    switchNetwork?.(props.lidoSuite.chain.id)
  }, [props.lidoSuite.chain.id, switchNetwork])

  return (
    <SideSheet
      title="Lido staking"
      onRequestDismiss={props.onRequestDismiss}
      css={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { padding: 0 },
      }}
    >
      <iframe
        src="https://stake.lido.fi/withdrawals/claim?ref=0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B"
        title="Lido Staking App"
        css={{ flex: 1, border: 'none', width: '100%', [SIDE_SHEET_WIDE_BREAK_POINT_SELECTOR]: { width: '55rem' } }}
      />
    </SideSheet>
  )
}
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
          fiatBalance=""
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
