import StakePosition from '@components/recipes/StakePosition'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { selectedEvmAccountsState } from '@domains/accounts'
import { useStakes } from '@domains/staking/slpx/core'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { useState } from 'react'

import type { SlpxPair } from '@domains/staking/slpx/types'
import { useRecoilValue } from 'recoil'
import { moonriver } from 'wagmi/chains'
import UnstakeDialog from './UnstakeDialog'
import AnimatedFiatNumber from '@components/widgets/AnimatedFiatNumber'
import RedactableBalance from '@components/widgets/RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import { slpxPairsState } from '@domains/staking/slpx'

const Stake = (props: { slpxPair: SlpxPair; position: ReturnType<typeof useStakes>[number] }) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  return (
    <ErrorBoundary orientation="horizontal">
      <StakePosition
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        readonly={props.position.account.readonly || !props.position.account.canSignEvm}
        account={props.position.account}
        provider="Bifrost liquid staking"
        stakeStatus={props.position.balance.planck.gtn(0) ? 'earning_rewards' : 'not_earning_rewards'}
        balance={<RedactableBalance>{props.position.balance.toHuman()}</RedactableBalance>}
        fiatBalance={<AnimatedFiatNumber end={props.position.fiatBalance} />}
        chain={moonriver.name}
        symbol={props.position.balance.unit}
        increaseStakeButton={<StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />}
        unstakeButton={
          props.position.balance.planck.gtn(0) && (
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          )
        }
        status={
          props.position.unlocking?.planck.gtn(0) && (
            <StakePosition.UnstakingStatus amount={props.position.unlocking?.toHuman()} unlocks={[]} />
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

const SlpxStakes = (props: { slpxPair: SlpxPair }) => {
  const stakes = useStakes(useRecoilValue(selectedEvmAccountsState), props.slpxPair)

  return (
    <>
      {stakes.map((x, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <Stake key={index} slpxPair={props.slpxPair} position={x} />
        </ErrorBoundary>
      ))}
    </>
  )
}

const Stakes = () => {
  const slpxPairs = useRecoilValue(slpxPairsState)

  return (
    <>
      {slpxPairs.map((slpxPair, index) => (
        <SlpxStakes key={index} slpxPair={slpxPair} />
      ))}
    </>
  )
}

export default () => (
  <PolkadotApiIdProvider id="wss://hk.p.bifrost-rpc.liebi.com/ws">
    <Stakes />
  </PolkadotApiIdProvider>
)
