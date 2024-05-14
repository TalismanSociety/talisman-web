import { writeableSubstrateAccountsState, type Account } from '../../../../domains/accounts'
import {
  ChainProvider,
  dappStakingEnabledChainsState,
  useChainState,
  useNativeTokenAmountState,
  useNativeTokenDecimalState,
  type ChainInfo,
} from '../../../../domains/chains'
import { useEraEta, useSubstrateApiState, useTokenAmountFromPlanck } from '../../../../domains/common'
import {
  useAddStakeForm,
  useApr,
  useRegisteredDappsState,
  useStake,
  type DappInfo,
} from '../../../../domains/staking/dappStaking'
import { Maybe } from '../../../../util/monads'
import { TalismanHandLoader } from '../../../legacy/TalismanHandLoader'
import DappStakingForm, { DappStakingSideSheet } from '../../../recipes/DappStakingForm'
import { DappSelectorDialog as DappSelectorDialogComponent } from '../../../recipes/StakeTargetSelectorDialog'
import { useAccountSelector } from '../../AccountSelector'
import ErrorBoundary from '../../ErrorBoundary'
import UnlockDuration from './UnlockDuration'
import type { AstarPrimitivesDappStakingSmartContract } from '@polkadot/types/lookup'
import { useQueryState } from '@talismn/react-polkadot-api'
import { CircularProgressIndicator, Select } from '@talismn/ui'
import BN from 'bn.js'
import { Suspense, useMemo, useState, useTransition, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue, waitForAll } from 'recoil'

type DappSelectorDialogProps = {
  selectedDapp?: DappInfo
  onRequestDismiss: () => unknown
  onConfirm: (dapp: DappInfo) => unknown
}

const DappSelectorDialog = (props: DappSelectorDialogProps) => {
  const [dapps, decimal] = useRecoilValue(waitForAll([useRegisteredDappsState(), useNativeTokenDecimalState()]))

  const [highlightedDapp, setHighlightedDapp] = useState(dapps[0])

  const [dappInfos, activeProtocol] = useRecoilValue(
    waitForAll([
      useQueryState(
        'dappStaking',
        'integratedDApps.multi',
        useMemo(() => dapps.map(x => (x.address.startsWith('0x') ? { Evm: x.address } : { Wasm: x.address })), [dapps])
      ),
      useQueryState('dappStaking', 'activeProtocolState', []),
    ])
  )

  const dappStakes = useRecoilValue(
    useQueryState(
      'dappStaking',
      'contractStake.multi',
      useMemo(() => dappInfos.map(x => x.unwrapOrDefault().id.unwrap()), [dappInfos])
    )
  )

  const dappsWithStake = dapps.map((dapp, index) => {
    const staked = Maybe.of(dappStakes.at(index)).mapOr(decimal.fromPlanck(0), x =>
      decimal.fromPlanck(
        Maybe.of(
          [x.stakedFuture.unwrapOrDefault(), x.staked].find(y =>
            y.period.unwrap().eq(activeProtocol.periodInfo.number.unwrap())
          )
        ).mapOr(0n, y => y.voting.toBigInt() + y.buildAndEarn.toBigInt())
      )
    )
    return { ...dapp, staked }
  })

  return (
    <DappSelectorDialogComponent
      {...props}
      onConfirm={() => {
        if (highlightedDapp !== undefined) {
          props.onConfirm(highlightedDapp)
        }
      }}
    >
      {dappsWithStake.map((dapp, index) => (
        <DappSelectorDialogComponent.Item
          key={dapp.address}
          selected={dapp.address === props.selectedDapp?.address}
          highlighted={dapp.address === highlightedDapp?.address}
          name={dapp.name}
          logo={dapp.iconUrl}
          balance={dapp.staked.toLocaleString()}
          count={dapp.stakerCount}
          talismanRecommended={index === 0}
          onClick={() => setHighlightedDapp(dapp)}
        />
      ))}
    </DappSelectorDialogComponent>
  )
}

type IncompleteStakeFormProps = {
  accountSelector: ReactNode
  assetSelector: ReactNode
  dappSelectionInProgress?: boolean
  selectedDappName?: ReactNode
  selectedDappLogo?: string
  onRequestDappChange: () => unknown
}

const InCompleteSelectionStakeForm = (props: IncompleteStakeFormProps) => (
  <DappStakingForm
    accountSelector={props.accountSelector}
    amountInput={<DappStakingForm.AmountInput assetSelector={props.assetSelector} disabled />}
    selectedDappName={props.selectedDappName}
    selectedDappLogo={props.selectedDappLogo}
    onRequestDappChange={props.onRequestDappChange}
    stakeButton={<DappStakingForm.StakeButton disabled />}
    estimatedRewards="..."
  />
)

const EstimatedRewards = (props: { amount: bigint }) => {
  const tokenAmount = useRecoilValue(useNativeTokenAmountState())
  const apr = useApr()
  const amount = useMemo(
    () => tokenAmount.fromPlanck(new BN(props.amount.toString()).muln(apr.totalApr).toString()),
    [apr.totalApr, props.amount, tokenAmount]
  )

  if (amount.decimalAmount === undefined) {
    return null
  }

  return (
    <>
      {amount.decimalAmount.toLocaleString()} / Year ({amount.localizedFiatAmount})
    </>
  )
}

type StakeFormProps = IncompleteStakeFormProps & {
  account: Account
  dapp: string | AstarPrimitivesDappStakingSmartContract | Uint8Array | { Evm: any } | { Wasm: any }
}

const StakeForm = (props: StakeFormProps) => {
  const stake = useStake(props.account)
  const { input, setAmount, available, extrinsic, ready, error } = useAddStakeForm(props.account, stake, props.dapp)

  return (
    <DappStakingForm
      accountSelector={props.accountSelector}
      amountInput={
        <DappStakingForm.AmountInput
          amount={input.amount}
          fiatAmount={input.localizedFiatAmount}
          onChangeAmount={setAmount}
          onRequestMaxAmount={() => setAmount(available.decimalAmount.toString())}
          availableToStake={available.decimalAmount.toLocaleString()}
          assetSelector={props.assetSelector}
          error={error?.message}
        />
      }
      dappSelectionInProgress={props.dappSelectionInProgress}
      selectedDappName={props.selectedDappName}
      selectedDappLogo={props.selectedDappLogo}
      onRequestDappChange={props.onRequestDappChange}
      stakeButton={
        <DappStakingForm.StakeButton
          disabled={!ready}
          loading={extrinsic.state === 'loading'}
          onClick={() => {
            void extrinsic.signAndSend(props.account.address)
          }}
        />
      }
      estimatedRewards={
        <Suspense fallback={<CircularProgressIndicator size="1em" />}>
          <EstimatedRewards
            amount={(input.decimalAmount?.planck ?? 0n) + (stake.totalStaked.decimalAmount?.planck ?? 0n)}
          />
        </Suspense>
      }
      currentStakedBalance={
        stake.totalStaked.decimalAmount !== undefined && stake.totalStaked.decimalAmount.planck > 0n
          ? stake.totalStaked.decimalAmount.toLocaleString()
          : undefined
      }
    />
  )
}

type StakeSideSheetProps = {
  chains: Array<Extract<ChainInfo, { hasDappStaking: true }>>
  onChangeChain: (chain: Extract<ChainInfo, { hasDappStaking: true }>) => unknown
  onRequestDismiss: () => unknown
}

const StakeSideSheetContent = (props: Omit<StakeSideSheetProps, 'onRequestDismiss'>) => {
  const [searchParams] = useSearchParams()

  const [chain, dapps] = useRecoilValue(waitForAll([useChainState(), useRegisteredDappsState()]))
  const [[account], accountSelector] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    searchParams.get('account') === null
      ? 0
      : accounts => accounts?.find(x => x.address === searchParams.get('account'))
  )
  const [dapp, setDapp] = useState(dapps.at(0))

  const [dappSelectorDialogOpen, setDappSelectorDialogOpen] = useState(false)
  const [dappSelectorDialogInTransition, startDappSelectorDialogTransition] = useTransition()
  const openDappSelectorDialog = () => startDappSelectorDialogTransition(() => setDappSelectorDialogOpen(true))

  const assetSelector = useMemo(
    () => (
      <Select
        value={chain.id}
        onChangeValue={id => {
          const chain = props.chains.find(x => x.id === id)
          if (chain !== undefined) {
            props.onChangeChain(chain)
          }
        }}
      >
        {props.chains.map(x => (
          <Select.Option
            key={x.id}
            value={x.id}
            headlineContent={x.nativeToken?.symbol ?? x.name}
            leadingIcon={<img src={x.nativeToken?.logo ?? x.logo} css={{ width: '2.4rem', aspectRatio: '1 / 1' }} />}
          />
        ))}
      </Select>
    ),
    [chain.id, props]
  )

  return (
    <>
      {account !== undefined && dapp !== undefined ? (
        <StakeForm
          account={account}
          dapp={dapp.address.startsWith('0x') ? { Evm: dapp.address } : { Wasm: dapp.address }}
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          dappSelectionInProgress={dappSelectorDialogInTransition}
          selectedDappName={dapp.name}
          selectedDappLogo={dapp.iconUrl}
          onRequestDappChange={openDappSelectorDialog}
        />
      ) : (
        <InCompleteSelectionStakeForm
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectedDappName={dapp?.name}
          selectedDappLogo={dapp?.iconUrl}
          onRequestDappChange={openDappSelectorDialog}
        />
      )}
      {dappSelectorDialogOpen && (
        <DappSelectorDialog
          selectedDapp={dapp}
          onRequestDismiss={() => setDappSelectorDialogOpen(false)}
          onConfirm={setDapp}
        />
      )}
    </>
  )
}

const Rewards = () => <>{useApr().totalApr.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })}</>

const NextEraEta = () => <>{useEraEta(1)}</>

const MinimumStake = () => (
  <>
    {useTokenAmountFromPlanck(
      useRecoilValue(useSubstrateApiState()).consts.dappStaking.minimumStakeAmount
    ).decimalAmount.toLocaleString()}
  </>
)

const _StakeSideSheet = (props: StakeSideSheetProps) => {
  return (
    <DappStakingSideSheet
      onRequestDismiss={props.onRequestDismiss}
      chainName={useRecoilValue(useChainState()).chainName}
      rewards={<Rewards />}
      nextEraEta={<NextEraEta />}
      minimumStake={<MinimumStake />}
      unbondingPeriod={<UnlockDuration />}
    >
      <ErrorBoundary orientation="vertical">
        <Suspense
          fallback={
            <div>
              {/* Dummy spacer */}
              <div css={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
                <InCompleteSelectionStakeForm
                  accountSelector={<Select />}
                  assetSelector={<Select />}
                  onRequestDappChange={() => {}}
                />
              </div>
              <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TalismanHandLoader />
              </div>
            </div>
          }
        >
          <StakeSideSheetContent {...props} />
        </Suspense>
      </ErrorBoundary>
    </DappStakingSideSheet>
  )
}

const StakeSideSheet = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialChain = searchParams.get('chain')

  const chains = useRecoilValue(dappStakingEnabledChainsState)

  const [chain, setChain] = useState(
    Maybe.of(initialChain).mapOrUndefined(x => chains.find(y => y.id === x)) ?? chains.at(0)
  )

  if (chain === undefined) {
    throw new Error(`Missing chain configs`)
  }

  return (
    <ChainProvider chain={chain}>
      <_StakeSideSheet
        chains={chains}
        onChangeChain={setChain}
        onRequestDismiss={() =>
          setSearchParams(sp => {
            sp.delete('action')
            sp.delete('type')
            sp.delete('chain')
            sp.delete('account')
            return sp
          })
        }
      />
    </ChainProvider>
  )
}

export default () => {
  const [searchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'dapp-staking'

  if (!open) {
    return null
  }

  return <StakeSideSheet />
}
