import { Select } from '@talismn/ui/molecules/Select'
import { Suspense, useEffect, useMemo, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { DEFAULT_SUBNET, ROOT_NETUID } from '@/components/widgets/staking/subtensor/constants'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { ChainInfo, subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { DEFAULT_DELEGATE, Delegate, MIN_SUBTENSOR_STAKE } from '@/domains/staking/subtensor/atoms/delegates'
import { useDelegateAprFormatted } from '@/domains/staking/subtensor/hooks/useApr'
import { useDelegates } from '@/domains/staking/subtensor/hooks/useDelegates'
import { useGetSubnetPools } from '@/domains/staking/subtensor/hooks/useGetSubnetPools'
import { useTotalTaoStakedFormatted } from '@/domains/staking/subtensor/hooks/useTotalTaoStakedFormatted'
import { SubnetPool } from '@/domains/staking/subtensor/types'
import { Maybe } from '@/util/monads'

import { DelegateSelectorDialog } from './DelegateSelectorDialog'
import { IncompleteSelectionStakeForm, StakeForm } from './StakeForm'
import { SubnetSelectorDialog } from './SubnetSelectorDialog'
import { SubtensorStakingSideSheet } from './SubtensorStakingForm'

type StakeSideSheetProps = {
  chains: Array<Extract<ChainInfo, { hasSubtensorStaking: true }>>
  onChangeChain: (chain: Extract<ChainInfo, { hasSubtensorStaking: true }>) => unknown
  onRequestDismiss: () => unknown
}

type StakeSideSheetContentProps = Omit<StakeSideSheetProps, 'onRequestDismiss'> & {
  delegate: Delegate | undefined
  subnet: SubnetPool | undefined
  isSelectSubnetDisabled: boolean
  setDelegate: React.Dispatch<React.SetStateAction<Delegate | undefined>>
  setSubnet: React.Dispatch<React.SetStateAction<SubnetPool | undefined>>
}

const StakeSideSheetContent = ({
  delegate,
  chains,
  subnet,
  isSelectSubnetDisabled,
  setSubnet,
  setDelegate,
  onChangeChain,
}: StakeSideSheetContentProps) => {
  const [searchParams] = useSearchParams()

  const chain = useRecoilValue(useChainState())
  const [[account], accountSelector] = useAccountSelector(
    useRecoilValue(writeableSubstrateAccountsState),
    searchParams.get('account') === null
      ? 0
      : accounts => accounts?.find(x => x.address === searchParams.get('account'))
  )

  const [delegateSelectorOpen, setDelegateSelectorOpen] = useState(false)
  const [subnetSelectorOpen, setSubnetSelectorOpen] = useState(false)
  const [delegateSelectorInTransition, startDelegateSelectorTransition] = useTransition()
  const [subnetSelectorInTransition, startSubnetSelectorTransition] = useTransition()
  const openDelegateSelector = () => startDelegateSelectorTransition(() => setDelegateSelectorOpen(true))
  const openSubnetSelector = () => startSubnetSelectorTransition(() => setSubnetSelectorOpen(!isSelectSubnetDisabled))

  const assetSelector = useMemo(
    () => (
      <Select
        value={chain.id}
        onChangeValue={id => {
          const chain = chains.find(x => x.id === id)
          if (chain !== undefined) {
            onChangeChain(chain)
          }
        }}
      >
        {chains.map(x => (
          <Select.Option
            key={x.id}
            value={x.id}
            headlineContent={x.nativeToken?.symbol ?? x.name}
            leadingIcon={<img src={x.nativeToken?.logo ?? x.logo} css={{ width: '2.4rem', aspectRatio: '1 / 1' }} />}
          />
        ))}
      </Select>
    ),
    [chain.id, chains, onChangeChain]
  )

  const subnetName = `${subnet?.netuid}: ${subnet?.symbol}`

  return (
    <>
      {account !== undefined && delegate !== undefined && subnet !== undefined ? (
        <StakeForm
          account={account}
          delegate={delegate.address}
          netuid={subnet.netuid}
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectionInProgress={delegateSelectorInTransition}
          subnetSelectionInProgress={subnetSelectorInTransition}
          selectedName={delegate.name}
          selectedSubnetName={subnetName}
          onRequestChange={openDelegateSelector}
          onSelectSubnet={openSubnetSelector}
          isSelectSubnetDisabled={isSelectSubnetDisabled}
        />
      ) : (
        <IncompleteSelectionStakeForm
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectedName={delegate?.name}
          selectedSubnetName={subnetName}
          onRequestChange={openDelegateSelector}
          onSelectSubnet={openSubnetSelector}
          isSelectSubnetDisabled={isSelectSubnetDisabled}
        />
      )}
      {delegateSelectorOpen && (
        <DelegateSelectorDialog
          selected={delegate}
          onRequestDismiss={() => setDelegateSelectorOpen(false)}
          onConfirm={setDelegate}
        />
      )}
      {subnetSelectorOpen && (
        <SubnetSelectorDialog
          selected={subnet}
          onRequestDismiss={() => setSubnetSelectorOpen(false)}
          onConfirm={setSubnet}
        />
      )}
    </>
  )
}

const StakeSideSheetForChain = (props: StakeSideSheetProps) => {
  const delegates = useDelegates()
  const { data: { data: subnetPools = [] } = {} } = useGetSubnetPools()
  const [delegate, setDelegate] = useState(delegates[DEFAULT_DELEGATE] ?? Object.values(delegates)[0])
  const [subnet, setSubnet] = useState<SubnetPool | undefined>(DEFAULT_SUBNET)
  const { nativeToken } = useRecoilValue(useChainState())

  const totalStaked = useTotalTaoStakedFormatted()
  const delegateApr = useDelegateAprFormatted(delegate?.address ?? DEFAULT_DELEGATE)

  useEffect(() => {
    const rootSubnet = subnetPools.find(subnetPool => subnetPool.netuid === ROOT_NETUID)
    if (rootSubnet) {
      setSubnet(rootSubnet)
    } else {
      setSubnet(DEFAULT_SUBNET)
    }
  }, [subnetPools, setSubnet])
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
                  onSelectSubnet={() => {}}
                  isSelectSubnetDisabled
                />
              </div>
              <div css={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TalismanHandLoader />
              </div>
            </div>
          }
        >
          <StakeSideSheetContent
            {...props}
            delegate={delegate!}
            subnet={subnet}
            isSelectSubnetDisabled={subnetPools.length === 0}
            setSubnet={setSubnet}
            setDelegate={setDelegate}
          />
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
