import StakePosition from '@components/recipes/StakePosition'
import ErrorBoundary from '@components/widgets/ErrorBoundary'
import { evmAccountsState } from '@domains/accounts'
import { useStakes } from '@domains/staking/slpx/core'
import { PolkadotApiIdProvider } from '@talismn/react-polkadot-api'
import { useState } from 'react'

import { glmrSlpxPair } from '@domains/staking/slpx/config'
import type { SlpxPair } from '@domains/staking/slpx/types'
import { useRecoilValue } from 'recoil'
import { moonriver } from 'wagmi/chains'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'

const Stake = (props: { slpxPair: SlpxPair; position: ReturnType<typeof useStakes>[number] }) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  return (
    <ErrorBoundary orientation="horizontal">
      <StakePosition
        account={props.position.account}
        provider="Bifrost liquid staking"
        stakeStatus={props.position.balance.planck.gtn(0) ? 'earning_rewards' : 'not_earning_rewards'}
        balance={props.position.balance.toHuman()}
        fiatBalance=""
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

const Stakes = () => {
  const stakes = useStakes(useRecoilValue(evmAccountsState), glmrSlpxPair)

  return (
    <>
      {stakes.map((x, index) => (
        <ErrorBoundary key={index} orientation="horizontal">
          <Stake key={index} slpxPair={glmrSlpxPair} position={x} />
        </ErrorBoundary>
      ))}
    </>
  )
}

export default () => (
  <PolkadotApiIdProvider id="wss://hk.p.bifrost-rpc.liebi.com/ws">
    <Stakes />
  </PolkadotApiIdProvider>
)