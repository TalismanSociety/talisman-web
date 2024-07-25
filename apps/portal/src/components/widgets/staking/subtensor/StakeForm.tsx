import { type Account } from '../../../../domains/accounts'
import { useChainState, useNativeTokenAmountState } from '../../../../domains/chains'
import { useAddStakeForm } from '../../../../domains/staking/subtensor/hooks/forms'
import { useApr } from '../../../../domains/staking/subtensor/hooks/useApr'
import { useStake } from '../../../../domains/staking/subtensor/hooks/useStake'
import { SubtensorStakingForm } from './SubtensorStakingForm'
import { CircularProgressIndicator } from '@talismn/ui'
import BN from 'bn.js'
import { Suspense, useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

type StakeFormProps = IncompleteSelectionStakeFormProps & {
  account: Account
  delegate: string
}

export const StakeForm = (props: StakeFormProps) => {
  const stake = useStake(props.account)
  const { input, setInput, amount, transferable, extrinsic, ready, error } = useAddStakeForm(
    props.account,
    stake,
    props.delegate
  )
  const navigate = useNavigate()

  return (
    <SubtensorStakingForm
      accountSelector={props.accountSelector}
      amountInput={
        <SubtensorStakingForm.AmountInput
          amount={input}
          fiatAmount={amount.localizedFiatAmount}
          onChangeAmount={setInput}
          onRequestMaxAmount={() => setInput(transferable.decimalAmount.toString())}
          availableToStake={transferable.decimalAmount.toLocaleString()}
          assetSelector={props.assetSelector}
          error={error?.message}
        />
      }
      selectionInProgress={props.selectionInProgress}
      selectedName={props.selectedName}
      onRequestChange={props.onRequestChange}
      stakeButton={
        <SubtensorStakingForm.StakeButton
          disabled={!ready}
          loading={extrinsic.state === 'loading'}
          onClick={() => {
            extrinsic.signAndSend(props.account.address).then(() => navigate('/staking/positions'))
          }}
        />
      }
      estimatedRewards={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <EstimatedRewards
            amount={(amount.decimalAmount?.planck ?? 0n) + (stake.totalStaked.decimalAmount?.planck ?? 0n)}
          />
        </Suspense>
      }
      currentStakedBalance={
        (stake?.totalStaked?.decimalAmount?.planck ?? 0n) > 0n
          ? stake?.totalStaked?.decimalAmount?.toLocaleString?.()
          : undefined
      }
    />
  )
}

type IncompleteSelectionStakeFormProps = {
  accountSelector: ReactNode
  assetSelector: ReactNode
  selectionInProgress?: boolean
  selectedName?: ReactNode
  onRequestChange: () => unknown
}
export const IncompleteSelectionStakeForm = (props: IncompleteSelectionStakeFormProps) => (
  <SubtensorStakingForm
    accountSelector={props.accountSelector}
    amountInput={<SubtensorStakingForm.AmountInput assetSelector={props.assetSelector} disabled />}
    selectedName={props.selectedName}
    onRequestChange={props.onRequestChange}
    stakeButton={<SubtensorStakingForm.StakeButton disabled />}
    estimatedRewards="..."
  />
)

const EstimatedRewards = (props: { amount: bigint }) => {
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  const genesisHash = useRecoilValue(useChainState())?.genesisHash
  const apr = useApr(genesisHash)
  const amount = useMemo(
    () => tokenAmount.fromPlanck(new BN(props.amount.toString()).muln(apr).toString()),
    [apr, props.amount, tokenAmount]
  )

  if (amount.decimalAmount === undefined) return null

  return (
    <>
      {amount.decimalAmount.toLocaleString()} / Year ({amount.localizedFiatAmount})
    </>
  )
}
