import { Select } from '@talismn/ui/molecules/Select'
import { Suspense, useMemo, useState, useTransition } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { TalismanHandLoader } from '@/components/legacy/TalismanHandLoader'
import { useAccountSelector } from '@/components/widgets/AccountSelector'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { writeableSubstrateAccountsState } from '@/domains/accounts/recoils'
import { useChainState } from '@/domains/chains/hooks'
import { ChainProvider } from '@/domains/chains/provider'
import { ChainInfo, subtensorStakingEnabledChainsState } from '@/domains/chains/recoils'
import { useCombineSubnetData } from '@/domains/staking/subtensor/hooks/useCombineSubnetData'
import { type BondOption, type SubnetData } from '@/domains/staking/subtensor/types'
import { Maybe } from '@/util/monads'

import { MIN_SUBTENSOR_ALPHA_STAKE, MIN_SUBTENSOR_ROOTNET_STAKE, ROOT_NETUID } from './constants'
import { DelegateSelectorDialog } from './DelegateSelectorDialog'
import { IncompleteSelectionStakeForm, StakeForm } from './StakeForm'
import { SubnetSelectorDialog } from './SubnetSelectorDialog'
import { SubtensorStakingSideSheet } from './SubtensorStakingForm'

type StakeSideSheetProps = {
  chains: Array<Extract<ChainInfo, { hasSubtensorStaking: true }>>
  onChangeChain: (chain: Extract<ChainInfo, { hasSubtensorStaking: true }>) => unknown
  onRequestDismiss: () => unknown
  hasDTaoStaking: boolean
}

type StakeSideSheetContentProps = Omit<StakeSideSheetProps, 'onRequestDismiss'> & {
  delegate: BondOption | undefined
  subnet: SubnetData | undefined
  isSelectSubnetDisabled: boolean
  setDelegate: React.Dispatch<React.SetStateAction<BondOption | undefined>>
  onHandleSubnetSelectConfirm: (subnet: SubnetData | undefined) => void
}

const StakeSideSheetContent = ({
  delegate,
  chains,
  subnet,
  isSelectSubnetDisabled,
  onHandleSubnetSelectConfirm,
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
  const hasDTaoStaking = searchParams.get('hasDTaoStaking') === 'true'

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

  const subnetName = subnet ? `${subnet?.netuid}: ${subnet.descriptionName} ${subnet?.symbol}` : undefined

  const poolNetuid = subnet?.netuid ? Number(subnet.netuid) : undefined
  const netuid = !hasDTaoStaking ? ROOT_NETUID : poolNetuid

  return (
    <>
      {account !== undefined ? (
        <StakeForm
          account={account}
          delegate={delegate?.poolId}
          netuid={netuid}
          accountSelector={accountSelector}
          assetSelector={assetSelector}
          selectionInProgress={delegateSelectorInTransition}
          subnetSelectionInProgress={subnetSelectorInTransition}
          selectedName={delegate?.name ?? undefined}
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
          onHandleSubnetSelectConfirm={onHandleSubnetSelectConfirm}
        />
      )}
    </>
  )
}

const StakeSideSheetForChain = (props: StakeSideSheetProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { subnetData } = useCombineSubnetData()
  const [delegate, setDelegate] = useState<BondOption | undefined>()
  const [subnet, setSubnet] = useState<SubnetData | undefined>()
  const { nativeToken } = useRecoilValue(useChainState())

  const handleSubnetSelectConfirm = (subnet: SubnetData | undefined) => {
    setSubnet(subnet)
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('netuid', subnet?.netuid?.toString() || '0')
    navigate({ pathname: location.pathname, search: searchParams.toString() })
  }

  return (
    <SubtensorStakingSideSheet
      onRequestDismiss={props.onRequestDismiss}
      chainName={useRecoilValue(useChainState()).chainName}
      minimumStake={
        <>
          {props.hasDTaoStaking ? MIN_SUBTENSOR_ALPHA_STAKE : MIN_SUBTENSOR_ROOTNET_STAKE} {nativeToken?.symbol}
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
            isSelectSubnetDisabled={!Object.values(subnetData).length}
            onHandleSubnetSelectConfirm={handleSubnetSelectConfirm}
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
  const hasDTaoStaking = searchParams.get('hasDTaoStaking') === 'true'

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
        hasDTaoStaking={hasDTaoStaking}
        onRequestDismiss={() =>
          setSearchParams(params => {
            params.delete('action')
            params.delete('type')
            params.delete('chain')
            params.delete('account')
            params.delete('hasDTaoStaking')
            params.delete('netuid')
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
