import StakeDialogComponent from '@components/recipes/StakeDialog'
import { chainsState } from '@domains/chains/recoils'
import { useEraEtaFormatter } from '@domains/common/hooks'
import { useInflation } from '@domains/nominationPools/hooks'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { Suspense, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import StakeForm from '@components/recipes/StakeForm/StakeForm'
import { type Chain, ChainProvider } from '@domains/chains'
import { AssetSelect, ControlledStakeForm } from './StakeForm'
import ErrorBoundary from '../ErrorBoundary'

const Rewards = () => {
  const { stakedReturn } = useInflation()
  return <>{stakedReturn.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</>
}

const EraEta = () => {
  return <>{useEraEtaFormatter()(new BN(1))}</>
}

const StakeDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const open = searchParams.get('action') === 'stake'
  const initialChain = searchParams.get('chain')

  const chains = useRecoilValue(chainsState)
  const [chain, setChain] = useState<Chain>(chains.find(x => x.id === initialChain) ?? chains[0])

  const [inTransition, startTransition] = useTransition()

  if (!open) {
    return null
  }

  return (
    <ChainProvider value={chain}>
      <StakeDialogComponent
        open={open}
        onRequestDismiss={() => setSearchParams(new URLSearchParams())}
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

export default StakeDialog
