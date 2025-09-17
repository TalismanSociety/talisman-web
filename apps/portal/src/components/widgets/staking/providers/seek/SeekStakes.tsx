import { useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import type { SlpxPair } from '@/domains/staking/slpx/types'
import SeekLogo from '@/assets/seek.svg'
import { StakePosition, StakePositionErrorBoundary } from '@/components/recipes/StakePosition'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'
import { Account, evmSignableAccountsState, selectedEvmAccountsState } from '@/domains/accounts/recoils'
import { ChainProvider } from '@/domains/chains/provider'
import { CHAIN_ID, CHAIN_NAME, DEEK_TICKER } from '@/domains/staking/seek/constants'
import { useStakes } from '@/domains/staking/slpx/core'
import { slpxPairsState } from '@/domains/staking/slpx/recoils'

import { useGetSeekStaked } from '../hooks/seek/hooks/useGetSeekStaked'

// import AddStakeDialog from './AddStakeDialog'
// import UnstakeDialog from './UnstakeDialog'

type StakesProps = {
  setShouldRenderLoadingSkeleton: React.Dispatch<React.SetStateAction<boolean>>
}

const SeekStakes = ({ setShouldRenderLoadingSkeleton }: StakesProps) => {
  const evmSignableAccounts = useRecoilValue(evmSignableAccountsState)

  return evmSignableAccounts.map((account, index) => <SeekStakePosition key={index} account={account} />)
}

// const Stake = (props: { slpxPair: SlpxPair; position: ReturnType<typeof useStakes>['data'][number] }) => {
const SeekStakePosition = ({ account }: { account: Account }) => {
  const [increaseStakeDialogOpen, setIncreaseStakeDialogOpen] = useState(false)
  const [unstakeDialogOpen, setUnstakeDialogOpen] = useState(false)

  const {
    data: { balances },
  } = useGetSeekStaked()

  const stakedBalance = balances.find(balance => balance.address === account.address)

  // TODO: Handle locked token status
  if (!stakedBalance?.amount) return null

  const { amountDecimal } = stakedBalance
  // TODO: fetch DEEK fiat price
  const fiatBalance = 0

  return (
    <ErrorBoundary
      orientation="horizontal"
      renderFallback={() => (
        <StakePositionErrorBoundary
          chain={CHAIN_NAME}
          assetSymbol={DEEK_TICKER}
          assetLogoSrc={SeekLogo}
          account={account}
          provider="Talisman"
        />
      )}
    >
      <StakePosition
        readonly={!account.canSignEvm}
        account={account}
        provider="Talisman"
        // TODO: Handle locked token status
        stakeStatus={amountDecimal.planck > 0n ? 'earning_rewards' : 'not_earning_rewards'}
        // stakeStatus={'earning_rewards'}
        balance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <RedactableBalance>{amountDecimal.toLocaleString()}</RedactableBalance>
          </ErrorBoundary>
        }
        fiatBalance={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <AnimatedFiatNumber end={fiatBalance} />
          </ErrorBoundary>
        }
        chain={CHAIN_NAME}
        chainId={CHAIN_ID}
        assetSymbol={DEEK_TICKER}
        assetLogoSrc={SeekLogo}
        increaseStakeButton={
          <ErrorBoundary renderFallback={() => <>--</>}>
            <StakePosition.IncreaseStakeButton onClick={() => setIncreaseStakeDialogOpen(true)} />
          </ErrorBoundary>
        }
        unstakeButton={
          // props.position.balance.planck > 0n && (
          //   <ErrorBoundary renderFallback={() => <>--</>}>
          //     <StakePosition.UnstakeButton onClick={() => setUnstakeDialogOpen(true)} />
          //   </ErrorBoundary>
          // )
          <button>Unstake</button>
        }
        unstakingStatus={
          // props.position.unlocking !== undefined &&
          // props.position.unlocking.planck > 0n && (
          //   <ErrorBoundary renderFallback={() => <>--</>}>
          //     <StakePosition.UnstakingStatus amount={props.position.unlocking?.toLocaleString()} unlocks={[]} />
          //   </ErrorBoundary>
          // )
          <div>Status</div>
        }
      />
      {/* {increaseStakeDialogOpen && (
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
      )} */}
    </ErrorBoundary>
  )
}

export default SeekStakes
