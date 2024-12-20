import { Select } from '@talismn/ui/molecules/Select'
import { Suspense, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { ChainInfo, subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { DEFAULT_DELEGATE, Delegate, MIN_SUBTENSOR_STAKE } from '@/domains/staking/subtensor/atoms/delegates'
import { useDelegateAprFormatted } from '@/domains/staking/subtensor/hooks/useApr'
import { useDelegates } from '@/domains/staking/subtensor/hooks/useDelegates'
import { useTotalTaoStakedFormatted } from '@/domains/staking/subtensor/hooks/useTotalTaoStakedFormatted'
import { Maybe } from '@/util/monads'

import { DelegateSelectorDialog } from './DelegateSelectorDialog'
import { IncompleteSelectionStakeForm, StakeForm } from './StakeForm'
import { SubtensorStakingSideSheet } from './SubtensorStakingForm'

type StakeSideSheetProps = {
  chains: Array<Extract<ChainInfo, { hasSubtensorStaking: true }>>
  onChangeChain: (chain: Extract<ChainInfo, { hasSubtensorStaking: true }>) => unknown
  onRequestDismiss: () => unknown
}

type StakeSideSheetContentProps = Omit<StakeSideSheetProps, 'onRequestDismiss'> & {
  delegate: Delegate | undefined
  setDelegate: React.Dispatch<React.SetStateAction<Delegate | undefined>>
}

const StakeSideSheetContent = (props: StakeSideSheetContentProps) => {
  const [searchParams] = useSearchParams()

  const chain = useRecoilValue(useChainState())
  const [[account], accountSelector] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    searchParams.get('account') === null
      ? 0
      : accounts => accounts?.find(x => x.address === searchParams.get('account'))
  )
  const { delegate, setDelegate } = props

  const [delegateSelectorOpen, setDelegateSelectorOpen] = useState(false)
  const [delegateSelectorInTransition, startDelegateSelectorTransition] = useTransition()
  const openDelegateSelector = () => startDelegateSelectorTransition(() => setDelegateSelectorOpen(true))

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
      {account !== undefined && delegate !== undefined ? (
        <StakeForm
          account={account}
          delegate={delegate.address}
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectionInProgress={delegateSelectorInTransition}
          selectedName={delegate.name}
          onRequestChange={openDelegateSelector}
        />
      ) : (
        <IncompleteSelectionStakeForm
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectedName={delegate?.name}
          onRequestChange={openDelegateSelector}
        />
      )}
      {delegateSelectorOpen && (
        <DelegateSelectorDialog
          selected={delegate}
          onRequestDismiss={() => setDelegateSelectorOpen(false)}
          onConfirm={setDelegate}
        />
      )}
    </>
  )
}

const StakeSideSheetForChain = (props: StakeSideSheetProps) => {
  const delegates = useDelegates()
  const [delegate, setDelegate] = useState(delegates[DEFAULT_DELEGATE] ?? Object.values(delegates)[0])
  const { nativeToken } = useRecoilValue(useChainState())

  const totalStaked = useTotalTaoStakedFormatted()
  const delegateApr = useDelegateAprFormatted(delegate?.address ?? DEFAULT_DELEGATE)

  return (
    <SubtensorStakingSideSheet
      onRequestDismiss={props.onRequestDismiss}
      chainName={useRecoilValue(useChainState()).chainName}
      info={useMemo(
        () => [
          {
            title: 'Total Staked',
            content: <>{totalStaked}</>,
          },
          { title: 'Estimated APR', content: <>{delegateApr}</> },
        ],
        [delegateApr, totalStaked]
      )}
      minimumStake={
        <>
          {MIN_SUBTENSOR_STAKE} {nativeToken?.symbol}
        </>
      }
    >
      <ErrorBoundary orientation="vertical">
        <Suspense
          fallback={
            <div>
              {/* Dummy spacer */}
              <div css={{ visibility: 'hidden', height: 0, overflow: 'hidden' }}>
                <IncompleteSelectionStakeForm
                  accountSelector={<Select />}
                  assetSelector={<Select />}
                  onRequestChange={() => {}}
                />
              </div>
              <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TalismanHandLoader />
              </div>
            </div>
          }
        >
          <StakeSideSheetContent {...props} delegate={delegate!} setDelegate={setDelegate} />
        </Suspense>
      </ErrorBoundary>
    </SubtensorStakingSideSheet>
  )
}

const StakeSideSheetOpen = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialChain = searchParams.get('chain')

  const chains = useRecoilValue(subtensorStakingEnabledChainsState)
  const [chain, setChain] = useState(
    Maybe.of(initialChain).mapOrUndefined(x => chains.find(y => y.id === x)) ?? chains.at(0)
  )

  if (chain === undefined) throw new Error(`Missing chain configs`)

  return (
    <ChainProvider chain={chain}>
      <StakeSideSheetForChain
        chains={chains}
        onChangeChain={setChain}
        onRequestDismiss={() =>
          setSearchParams(params => {
            params.delete('action')
            params.delete('type')
            params.delete('chain')
            params.delete('account')
            return params
          })
        }
      />
    </ChainProvider>
  )
}

export const StakeSideSheet = () => {
  const [searchParams] = useSearchParams()
  const open = searchParams.get('action') === 'stake' && searchParams.get('type') === 'subtensor'

  if (!open) return null
  return <StakeSideSheetOpen />
}
