import Text from '@components/atoms/Text'
import Details from '@components/molecules/Details'
import HiddenDetails from '@components/molecules/HiddenDetails'
import InfoCard from '@components/molecules/InfoCard'
import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import StakingInput from '@components/recipes/StakingInput'
import { accountsState, polkadotAccountsState } from '@domains/accounts/recoils'
import { apiState, currentChainState, nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountFromAtomics } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { useCountDownToNomsPool, usePoolAddForm } from '@domains/nominationPools/hooks'
import { useTheme } from '@emotion/react'
import { BN } from '@polkadot/util'
import { differenceInHours, formatDistance, formatDuration, intervalToDuration } from 'date-fns'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { selector, useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

export const recommendedPoolsState = selector({
  key: 'Staking/BondedPools',
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

    return bondedPools.map((x, index) => ({
      ...x,
      name:
        index === 0
          ? // TODO: for demo purpose only
            'Talisman 🧿'
          : names[index]?.toUtf8(),
    }))
  },
})

const availableToStakeState = selector({
  key: 'Staking/AvailableToStake',
  get: async ({ get }) => {
    const api = get(apiState)
    const accounts = get(polkadotAccountsState)

    const balances = await Promise.all(accounts.map(({ address }) => api.derive.balances.all(address)))

    return balances.reduce(
      (prev, curr) => curr.availableBalance.sub(api.consts.balances.existentialDeposit).add(prev),
      new BN(0)
    )
  },
})

const PoolSelector = (props: {
  open: boolean
  selectedPoolId: number
  onChangePoolId: (poolId: number) => unknown
  onDismiss: () => unknown
}) => {
  const [newPoolId, setNewPoolId] = useState<number>()
  const [recommendedPools, nativeTokenDecimal, currentChain] = useRecoilValue(
    waitForAll([recommendedPoolsState, nativeTokenDecimalState, currentChainState])
  )

  return (
    <PoolSelectorDialog
      open={props.open}
      onRequestDismiss={useCallback(() => {
        props.onDismiss()
        setNewPoolId(undefined)
      }, [props])}
      onConfirm={useCallback(() => {
        if (newPoolId !== undefined) {
          props.onChangePoolId(newPoolId)
          setNewPoolId(undefined)
        }
        props.onDismiss()
      }, [newPoolId, props])}
    >
      {recommendedPools.map(pool => (
        <PoolSelectorDialog.Item
          selected={pool.poolId.eqn(props.selectedPoolId)}
          highlighted={newPoolId !== undefined && pool.poolId.eqn(newPoolId)}
          talismanRecommended
          poolName={pool.name ?? ''}
          poolDetailUrl={
            currentChain.subscanUrl === null
              ? undefined
              : new URL(`nomination_pool/${pool.poolId.toString()}`, currentChain.subscanUrl).toString()
          }
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
  // TODO: remove
  const nomsPoolCountDown = useCountDownToNomsPool()
  const theme = useTheme()

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
    availableBalance,
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

  const availableToStake = useTokenAmountFromAtomics(useRecoilValueLoadable(availableToStakeState).valueMaybe())

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

  // TODO: for demo purpose only
  const demoPoolName =
    selectedPoolId === recommendedPools[0]?.poolId.toNumber()
      ? 'Talisman 🧿'
      : poolMetadataLoadable.valueMaybe()?.toUtf8() ?? ''

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
          <InfoCard
            headlineText="Available to stake"
            text={availableToStake.decimalAmount?.toHuman() ?? '...'}
            supportingText={availableToStake.localizedFiatAmount ?? '...'}
          />
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
            <HiddenDetails
              hidden={nomsPoolCountDown?.blocksRemaining !== undefined}
              variant="dim"
              overlay={
                <div
                  css={{
                    textAlign: 'center',
                  }}
                >
                  <Text.H3 css={{ color: theme.color.primary }}>Staking will unlock in</Text.H3>
                  <Text.Body alpha="high" css={{ fontSize: '1.6rem' }}>
                    {nomsPoolCountDown?.eta === undefined
                      ? '...'
                      : differenceInHours(0, nomsPoolCountDown.eta) === 0
                      ? formatDistance(0, nomsPoolCountDown.eta)
                      : formatDuration(intervalToDuration({ start: 0, end: nomsPoolCountDown.eta }), {
                          format: ['days', 'hours', 'minutes'],
                        })}
                  </Text.Body>
                </div>
              }
            >
              <StakingInput
                portfolioHref="/portfolio#staking"
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
                  if (availableBalance.decimalAmount !== undefined) {
                    setAmount(availableBalance.decimalAmount.toString())
                  }
                }}
                availableToStake={availableBalance.decimalAmount?.toHuman() ?? '...'}
                noPoolsAvailable={recommendedPools.length === 0}
                poolName={demoPoolName}
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
                  if (!isReady || inputError !== undefined || decimalAmount.atomics.isZero()) return 'disabled'

                  return joinPoolExtrinsic.state === 'loading' ? 'pending' : undefined
                }, [decimalAmount?.atomics, inputError, isReady, joinPoolExtrinsic.state])}
              />
            </HiddenDetails>
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
