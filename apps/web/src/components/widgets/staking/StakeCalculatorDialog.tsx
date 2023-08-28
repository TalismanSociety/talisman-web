import StakeCalculatorDialogComponent from '@components/recipes/StakeCalculatorDialog'
import { chainsState, type Chain, ChainProvider, ChainContext } from '@domains/chains'
import { useTokenAmount, useTokenAmountFromPlanck } from '@domains/common'
import { useInflation } from '@domains/nominationPools'
import { Suspense, useContext, useDeferredValue, useMemo, useState, useTransition } from 'react'
import { useRecoilValue } from 'recoil'
import { AssetSelect } from './StakeForm'
import ErrorBoundary from '../ErrorBoundary'

type StakeCalculatorDialogProps = { open?: boolean; onRequestDismiss: () => unknown }

const EstimatedYield = (props: { amount: string }) => {
  const { stakedReturn } = useInflation()

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
  const chains = useRecoilValue(chainsState)
  const [chain, setChain] = useState<Chain>(useContext(ChainContext) ?? chains[0])
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
