import StakeCalculatorDialogComponent from '@components/recipes/StakeCalculatorDialog'
import { ChainProvider, nominationPoolsEnabledChainsState, useChainState } from '@domains/chains'
import { useTokenAmount, useTokenAmountFromPlanck } from '@domains/common'
import { useApr } from '@domains/staking/substrate/nominationPools'
import { Suspense, useDeferredValue, useMemo, useState, useTransition } from 'react'
import { useRecoilValue } from 'recoil'
import ErrorBoundary from '../../ErrorBoundary'
import { AssetSelect } from './StakeForm'

type StakeCalculatorDialogProps = { open?: boolean; onRequestDismiss: () => unknown }

const EstimatedYield = (props: { amount: string }) => {
  const stakedReturn = useApr()

  const amount = useTokenAmount(props.amount)

  const annualYield = useTokenAmountFromPlanck(
    useMemo(() => amount.decimalAmount?.planck.muln(stakedReturn), [amount.decimalAmount?.planck, stakedReturn])
  )

  const monthlyYield = useTokenAmountFromPlanck(
    useMemo(() => annualYield.decimalAmount?.planck.divn(12), [annualYield.decimalAmount?.planck])
  )

  const weeklyYield = useTokenAmountFromPlanck(
    useMemo(() => annualYield.decimalAmount?.planck.divn(52), [annualYield.decimalAmount?.planck])
  )

  const dailyYield = useTokenAmountFromPlanck(
    useMemo(() => annualYield.decimalAmount?.planck.divn(365), [annualYield.decimalAmount?.planck])
  )

  return (
    <StakeCalculatorDialogComponent.EstimatedYield
      annualYield={annualYield.decimalAmount?.toHuman()}
      monthlyYield={monthlyYield.decimalAmount?.toHuman()}
      weeklyYield={weeklyYield.decimalAmount?.toHuman()}
      dailyYield={dailyYield.decimalAmount?.toHuman()}
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
