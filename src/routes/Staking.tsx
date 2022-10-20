import Details from '@components/molecules/Details'
import InfoCard from '@components/molecules/InfoCard'
import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import StakingInput from '@components/recipes/StakingInput'
import { apiState, nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountFromAtomics } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { accountsState } from '@domains/extension/recoils'
import { usePoolAddForm } from '@domains/nominationPools/hooks'
import { BN } from '@polkadot/util'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { selector, useRecoilValue, waitForAll } from 'recoil'

export const recommendedPoolsState = selector({
  key: 'BondedPools',
  get: async ({ get }) => {
    const api = get(apiState)

    const bondedPools = await api.query.nominationPools.bondedPools
      .entries()
      .then(x =>
        x
          .map(([poolId, bondedPool]) => ({ poolId: poolId.args[0], bondedPool }))
          .sort((a, b) => b.bondedPool.unwrapOrDefault().points.sub(a.bondedPool.unwrapOrDefault().points).toNumber())
      )

    const names = await api.query.nominationPools.metadata.multi(bondedPools.map(({ poolId }) => poolId))

    return bondedPools.map((x, index) => ({ ...x, name: names[index]?.toUtf8() }))
  },
})

const PoolSelector = (props: {
  open: boolean
  selectedPoolId: number
  onChangePoolId: (poolId: number) => unknown
  onDismiss: () => unknown
}) => {
  const [newPoolId, setNewPoolId] = useState<number>()
  const [recommendedPools, nativeTokenDecimal] = useRecoilValue(
    waitForAll([recommendedPoolsState, nativeTokenDecimalState])
  )

  return (
    <PoolSelectorDialog
      open={props.open}
      onRequestDismiss={props.onDismiss}
      onConfirm={() => {
        if (newPoolId !== undefined) {
          props.onChangePoolId(newPoolId)
        }
        props.onDismiss()
      }}
    >
      {recommendedPools.map(pool => (
        <PoolSelectorDialog.Item
          selected={pool.poolId.eqn(props.selectedPoolId)}
          highlighted={newPoolId !== undefined && pool.poolId.eqn(newPoolId)}
          talismanRecommended
          poolName={pool.name ?? ''}
          stakedAmount={`${nativeTokenDecimal.fromAtomics(pool.bondedPool.unwrapOrDefault().points).toHuman()} staked`}
          rating={3}
          memberCount={pool.bondedPool.unwrapOrDefault().memberCounter.toString()}
          onClick={() => setNewPoolId(pool.poolId.toNumber())}
        />
      ))}
    </PoolSelectorDialog>
  )
}

const Staking = () => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')
  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra')

  const [accounts, recommendedPools] = useRecoilValue(waitForAll([accountsState, recommendedPoolsState]))

  const [selectedPoolId, setSelectedPoolId] = useState(recommendedPools[0]?.poolId.toNumber())
  const [showPoolSelector, setShowPoolSelector] = useState(false)

  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number] | undefined>(accounts[0])
  const selectedAccountIndex = useMemo(
    () => accounts.findIndex(({ address }) => address === selectedAccount?.address),
    [accounts, selectedAccount?.address]
  )

  const {
    input: { amount, decimalAmount, localizedFiatAmount },
    isReady: isInputReady,
    freeBalance,
    error: inputError,
    setAmount,
  } = usePoolAddForm(selectedAccount?.address)
  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: selectedAccount?.address !== undefined,
    }
  )

  const totalStaked = useTokenAmountFromAtomics(
    useMemo(
      () =>
        poolMembersLoadable.valueMaybe()?.reduce((prev, curr) => prev.add(curr.unwrapOrDefault().points), new BN(0)),
      [poolMembersLoadable]
    )
  )

  const totalUnstaking = useTokenAmountFromAtomics(
    useMemo(
      () =>
        poolMembersLoadable.valueMaybe()?.reduce((prev, curr) => {
          for (const [_, unbonding] of curr.unwrapOrDefault().unbondingEras.entries()) {
            prev.iadd(unbonding)
          }
          return prev
        }, new BN(0)),
      [poolMembersLoadable]
    )
  )

  const bondedPoolLoadable = useChainState('query', 'nominationPools', 'bondedPools', [selectedPoolId!], {
    enabled: selectedPoolId !== undefined,
  })

  const { decimalAmount: poolTotalStaked } = useTokenAmountFromAtomics(
    bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().points
  )

  const poolMetadataLoadable = useChainState('query', 'nominationPools', 'metadata', [selectedPoolId!], {
    enabled: selectedPoolId !== undefined,
  })

  const hasExistingPool = poolMembersLoadable.valueMaybe()?.[selectedAccountIndex]?.isSome === true

  const isReady =
    selectedAccount !== undefined &&
    decimalAmount !== undefined &&
    poolMembersLoadable.state === 'hasValue' &&
    isInputReady

  useEffect(() => {
    if (selectedAccount === undefined && accounts.length > 0) {
      setSelectedAccount(accounts[0])
    }
  }, [accounts, selectedAccount])

  useEffect(() => {
    setSelectedPoolId(recommendedPools[0]?.poolId.toNumber())
  }, [recommendedPools, selectedAccount])

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6.4rem 1.8rem 1.8rem 1.8rem',
      }}
    >
      <PoolSelector
        open={showPoolSelector}
        selectedPoolId={selectedPoolId!}
        onChangePoolId={setSelectedPoolId}
        onDismiss={useCallback(() => setShowPoolSelector(false), [])}
      />
      <div
        css={{
          '@media (min-width: 768px)': {
            width: '86rem',
          },
        }}
      >
        <div
          css={{
            'display': 'flex',
            'flexDirection': 'column',
            'gap': '1.6rem',
            'marginBottom': '5.5rem',
            '@media (min-width: 768px)': {
              'flexDirection': 'row',
              '> *': { flex: 1 },
            },
          }}
        >
          <InfoCard headlineText="Available to stake" text="1450.22 DOT" supportingText="$9,030.00" />
          <InfoCard
            headlineText="Staking"
            text={totalStaked.decimalAmount?.toHuman() ?? '...'}
            supportingText={totalStaked.localizedFiatAmount ?? '...'}
          />
          <InfoCard headlineText="Rewards" text="17.56% APR" />
          <InfoCard
            headlineText="Unstaking"
            text={totalUnstaking.decimalAmount?.toHuman() ?? '...'}
            supportingText={totalUnstaking.localizedFiatAmount ?? '...'}
          />
        </div>
        <div
          css={{
            '@media (min-width: 768px)': {
              'display': 'flex',
              'gap': '3.2rem',
              '> *': { flex: 1 },
            },
          }}
        >
          <div css={{ marginBottom: '5.5rem' }}>
            <StakingInput
              alreadyStaking={hasExistingPool}
              accounts={accounts.map(x => ({
                ...x,
                selected: x.address === selectedAccount?.address,
                name: x.name ?? x.address,
                balance: '',
              }))}
              onSelectAccount={useCallback(
                x => setSelectedAccount(accounts.find(account => account.address === x.address)!),
                [accounts]
              )}
              amount={amount}
              fiatAmount={localizedFiatAmount ?? ''}
              onChangeAmount={setAmount}
              isError={inputError !== undefined}
              inputSupportingText={inputError?.message}
              onRequestMaxAmount={() => {
                if (freeBalance.decimalAmount !== undefined) {
                  setAmount(freeBalance.decimalAmount.toString())
                }
              }}
              availableToStake={freeBalance.decimalAmount?.toHuman() ?? '...'}
              poolName={poolMetadataLoadable.valueMaybe()?.toUtf8() ?? ''}
              poolTotalStaked={poolTotalStaked?.toHuman() ?? ''}
              poolMemberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
              onRequestPoolChange={useCallback(() => setShowPoolSelector(true), [])}
              onSubmit={useCallback(() => {
                if (selectedAccount === undefined || decimalAmount?.atomics === undefined) return
                if (hasExistingPool) {
                  bondExtraExtrinsic.signAndSend(selectedAccount.address, {
                    FreeBalance: decimalAmount.atomics.toString(),
                  })
                } else if (selectedPoolId !== undefined) {
                  joinPoolExtrinsic.signAndSend(
                    selectedAccount.address,
                    decimalAmount.atomics.toString(),
                    selectedPoolId
                  )
                }
              }, [
                bondExtraExtrinsic,
                decimalAmount?.atomics,
                hasExistingPool,
                joinPoolExtrinsic,
                selectedAccount,
                selectedPoolId,
              ])}
              submitState={useMemo(() => {
                if (!isReady || inputError !== undefined) return 'disabled'

                return joinPoolExtrinsic.state === 'loading' ? 'pending' : undefined
              }, [inputError, isReady, joinPoolExtrinsic.state])}
            />
          </div>
          <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
            <Details
              summary="What is nomination pool staking?"
              content="Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf. Learn more"
            />
            <Details
              summary="How is the reward rate calculated?"
              content="Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf. Learn more"
            />
            <Details
              summary="How do I claim my staking rewards?"
              content="Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf. Learn more"
            />
            <Details
              summary="How does Talisman pick which pool to enter?"
              content="Unlike nominating staking using pools requires a smaller amount of DOT, and the pool manages nominees on your behalf. Learn more"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Staking
