import BN from 'bn.js'
import { Suspense, useDeferredValue, useMemo, useState, useTransition } from 'react'
import { useRecoilValue } from 'recoil'

import { StakeCalculatorDialog as StakeCalculatorDialogComponent } from '@/components/recipes/StakeCalculatorDialog'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { nominationPoolsEnabledChainsState } from '@/domains/chains/recoils'
import { useTokenAmount, useTokenAmountFromPlanck } from '@/domains/common/hooks/useTokenAmount'
import { useApr } from '@/domains/staking/substrate/nominationPools/hooks'

import { AssetSelect } from './StakeForm'

type StakeCalculatorDialogProps = { open?: boolean; onRequestDismiss: () => unknown }

const EstimatedYield = (props: { amount: string }) => {
  const stakedReturn = useApr()

  const amount = useTokenAmount(props.amount)

  const bnPlanck = useMemo(
    () => (amount.decimalAmount === undefined ? undefined : new BN(amount.decimalAmount.planck.toString())),
    [amount.decimalAmount]
  )

  const annualYield = useTokenAmountFromPlanck(useMemo(() => bnPlanck?.muln(stakedReturn), [bnPlanck, stakedReturn]))

  const monthlyYield = useTokenAmountFromPlanck(useMemo(() => bnPlanck?.divn(12), [bnPlanck]))

  const weeklyYield = useTokenAmountFromPlanck(useMemo(() => bnPlanck?.divn(52), [bnPlanck]))

  const dailyYield = useTokenAmountFromPlanck(useMemo(() => bnPlanck?.divn(365), [bnPlanck]))

  return (
    <StakeCalculatorDialogComponent.EstimatedYield
      annualYield={annualYield.decimalAmount?.toLocaleString()}
      monthlyYield={monthlyYield.decimalAmount?.toLocaleString()}
      weeklyYield={weeklyYield.decimalAmount?.toLocaleString()}
      dailyYield={dailyYield.decimalAmount?.toLocaleString()}
    />
  )
}

const StakeCalculatorDialog = (props: StakeCalculatorDialogProps) => {
  const [inTransition, startTransition] = useTransition()
  const chains = useRecoilValue(nominationPoolsEnabledChainsState)
  const [chain, setChain] = useState(useRecoilValue(useChainState()) ?? chains[0])
  const [amount, setAmount] = useState('')

  return (
    <StakeCalculatorDialogComponent
      open={props.open}
      onRequestDismiss={props.onRequestDismiss}
      assetSelector={
        <AssetSelect
          chains={chains}
          selectedChain={chain}
          onSelectChain={chain => startTransition(() => setChain(chain))}
          inTransition={inTransition}
        />
      }
      amount={amount}
      onChangeAmount={setAmount}
      yield={
        <ErrorBoundary>
          <Suspense fallback={<StakeCalculatorDialogComponent.EstimatedYield />}>
            <ChainProvider chain={chain}>
              <EstimatedYield amount={useDeferredValue(amount)} />
            </ChainProvider>
          </Suspense>
        </ErrorBoundary>
      }
    />
  )
}

export default StakeCalculatorDialog
