import { selectedEvmAccountsState } from '../../../../domains/accounts'
import { ChainProvider } from '../../../../domains/chains'
import { slpxPairsState } from '../../../../domains/staking/slpx'
import { useStakes } from '../../../../domains/staking/slpx/core'
import type { SlpxPair } from '../../../../domains/staking/slpx/types'
import StakePosition from '../../../recipes/StakePosition'
import AnimatedFiatNumber from '../../AnimatedFiatNumber'
import ErrorBoundary from '../../ErrorBoundary'
import RedactableBalance from '../../RedactableBalance'
import AddStakeDialog from './AddStakeDialog'
import UnstakeDialog from './UnstakeDialog'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

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
        stakeStatus={props.position.balance.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
        balance={<RedactableBalance>{props.position.balance.toLocaleString()}</RedactableBalance>}
        fiatBalance={<AnimatedFiatNumber end={props.position.fiatBalance} />}
        chain={props.slpxPair.chain.name}
        symbol={props.position.balance.options?.currency}
        increaseStakeButton={<StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />}
        unstakeButton={
          props.position.balance.planck > 0n && (
            <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          )
        }
        status={
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
        <ChainProvider
          key={index}
          chain={{
            genesisHash: slpxPair.substrateChainGenesisHash,
          }}
        >
          <SlpxStakes slpxPair={slpxPair} />
        </ChainProvider>
      ))}
    </>
  )
}

export default Stakes
