import StakeDialogComponent from '@components/recipes/StakeDialog'
import { nominationPoolsEnabledChainsState, type ChainInfo } from '@domains/chains/recoils'
import { useEraEtaFormatter } from '@domains/common/hooks'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { Suspense, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import StakeForm from '@components/recipes/StakeForm/StakeForm'
import { ChainProvider } from '@domains/chains'
import { useApr } from '@domains/staking/substrate/nominationPools'
import ErrorBoundary from '../../ErrorBoundary'
import { AssetSelect, ControlledStakeForm } from './StakeForm'

const Rewards = () => {
  return <>{useApr().toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</>
}

const EraEta = () => {
  return <>{useEraEtaFormatter()(new BN(1))}</>
}

const InnerStakeDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'nomination-pools'
  const initialChain = searchParams.get('chain')
  const account = searchParams.get('account') ?? undefined

  const chains = useRecoilValue(nominationPoolsEnabledChainsState)
  const [chain, setChain] = useState<ChainInfo | undefined>(chains.find(x => x.id === initialChain) ?? chains[0])

  const [inTransition, startTransition] = useTransition()

  if (chain === undefined) {
    throw new Error(`Missing chain configs`)
  }

  if (!open) {
    return null
  }

  return (
    <ChainProvider chain={chain}>
      <StakeDialogComponent
        open={open}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            sp.delete('chain')
            sp.delete('account')
            return sp
          })
        }
        stats={
          <ErrorBoundary>
            <StakeDialogComponent.Stats>
              <StakeDialogComponent.Stats.Item
                headlineText="Rewards"
                text={
                  <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                    <Rewards />
                  </Suspense>
                }
              />
              <StakeDialogComponent.Stats.Item
                headlineText="Current era ends"
                text={
                  <Suspense fallback={<CircularProgressIndicator size="1em" />}>
                    <EraEta />
                  </Suspense>
                }
              />
            </StakeDialogComponent.Stats>
          </ErrorBoundary>
        }
        stakeInput={
          <ErrorBoundary>
            <Suspense fallback={<StakeForm.Skeleton />}>
              <ControlledStakeForm
                account={account}
                assetSelector={
                  <AssetSelect
                    chains={chains}
                    selectedChain={chain}
                    onSelectChain={chain => startTransition(() => setChain(chain))}
                    inTransition={inTransition}
                  />
                }
              />
            </Suspense>
          </ErrorBoundary>
        }
        learnMoreAnchor={
          <StakeDialogComponent.LearnMore
            href="https://docs.talisman.xyz/talisman/navigating-the-paraverse/using-the-talisman-portal/one-click-staking"
            target="_blank"
          />
        }
      />
    </ChainProvider>
  )
}

// TODO: Clean this up
// we use a wrapper component to reset the dialog state on close
// this is right now the safest change
const NominationPoolsStakeSideSheet = () => {
  const [searchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake'

  if (!open) {
    return null
  }

  return <InnerStakeDialog />
}

export default NominationPoolsStakeSideSheet
