import CircularProgressIndicator from '@components/atoms/CircularProgressIndicator'
import Text from '@components/atoms/Text'
import Details from '@components/molecules/Details'
import HiddenDetails from '@components/molecules/HiddenDetails'
import InfoCard from '@components/molecules/InfoCard'
import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import StakingInput from '@components/recipes/StakingInput'
import { polkadotAccountsState } from '@domains/accounts/recoils'
import { apiState, chainState, nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountFromAtomics } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { chainReadIdState } from '@domains/common/recoils'
import { useCountDownToNomsPool, useInflation, usePoolAddForm } from '@domains/nominationPools/hooks'
import { eraStakersState, recommendedPoolsState } from '@domains/nominationPools/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { useTheme } from '@emotion/react'
import { BN } from '@polkadot/util'
import { Maybe } from '@util/monads'
import { differenceInHours, formatDistance, formatDuration, intervalToDuration } from 'date-fns'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { constSelector, selector, useRecoilValue, useRecoilValueLoadable, waitForAll } from 'recoil'

const availableToStakeState = selector({
  key: 'Staking/AvailableToStake',
  get: async ({ get }) => {
    get(chainReadIdState)

    const api = get(apiState)
    const accounts = get(polkadotAccountsState)

    const balances = await Promise.all(accounts.map(({ address }) => api.derive.balances.all(address)))

    return balances.reduce(
      (prev, curr) => BN.max(new BN(0), curr.availableBalance.sub(api.consts.balances.existentialDeposit)).add(prev),
      new BN(0)
    )
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

const Statistics = () => {
  const accounts = useRecoilValue(polkadotAccountsState)
  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  const availableToStake = useTokenAmountFromAtomics(useRecoilValueLoadable(availableToStakeState).valueMaybe())

  const totalStaked = useTokenAmountFromAtomics(
    useMemo(
      () =>
        accounts.length === 0
          ? new BN(0)
          : poolMembersLoadable
              .valueMaybe()
              ?.reduce((prev, curr) => prev.add(curr.unwrapOrDefault().points), new BN(0)),
      [accounts.length, poolMembersLoadable]
    )
  )

  const totalUnstaking = useTokenAmountFromAtomics(
    useMemo(
      () =>
        accounts.length === 0
          ? new BN(0)
          : poolMembersLoadable.valueMaybe()?.reduce((prev, curr) => {
              for (const [_, unbonding] of curr.unwrapOrDefault().unbondingEras.entries()) {
                prev.iadd(unbonding)
              }
              return prev
            }, new BN(0)),
      [accounts.length, poolMembersLoadable]
    )
  )

  const inflation = useInflation().valueMaybe()

  return (
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
        text={availableToStake.decimalAmount?.toHuman() ?? <CircularProgressIndicator size="1em" />}
        supportingText={availableToStake.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      />
      <InfoCard
        headlineText="Staking"
        text={totalStaked.decimalAmount?.toHuman() ?? <CircularProgressIndicator size="1em" />}
        supportingText={totalStaked.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      />
      <InfoCard
        headlineText="Rewards"
        text={
          inflation === undefined ? (
            <CircularProgressIndicator size="1em" />
          ) : (
            `${inflation?.stakedReturn.toLocaleString(undefined, { style: 'percent', maximumFractionDigits: 2 })} APR`
          )
        }
      />
      <InfoCard
        headlineText="Unstaking"
        text={totalUnstaking.decimalAmount?.toHuman() ?? <CircularProgressIndicator size="1em" />}
        supportingText={totalUnstaking.localizedFiatAmount ?? <CircularProgressIndicator size="1em" />}
      />
    </div>
  )
}

const Faq = () => {
  const faqs = [
    {
      summary: 'What is nomination pool staking?',
      content: (
        <Text.Body>
          Nomination pools allow participants to permissionlessly pool funds together to stake as a group. Benefits of
          contributing your stake to a nomination pool include no staking minimum, no need for a stash and controller
          account, and the selection of validators on your behalf.{' '}
          <Text.A href="https://wiki.polkadot.network/docs/learn-nomination-pools" target="_blank">
            Learn more
          </Text.A>
          .
        </Text.Body>
      ),
    },
    {
      summary: 'How is the reward rate calculated?',
      content: (
        <Text.Body>
          The rewards rate listed is an estimated annual yield based on historical polkadot reward and inflation rates.
          Your real reward rate may vary with these rates, as well as any commission the validators you choose elect to
          take. You can consult the name of your pool for information.
        </Text.Body>
      ),
    },
    {
      summary: 'How do I unstake my Polkadot?',
      content: (
        <Text.Body>
          You can unstake at any time from the{' '}
          <Text.A as={Link} to="/portfolio#staking">
            portfolio page
          </Text.A>
          . There is a 28-day unstaking period (often termed unbonding) on Polkadot before your funds become available
          to withdraw.
        </Text.Body>
      ),
    },
    {
      summary: 'How do I claim my staking rewards?',
      content: (
        <Text.Body>
          You can claim accumulated rewards on the{' '}
          <Text.A as={Link} to="/portfolio#staking">
            portfolio page
          </Text.A>
          . Ensure you have either "All Accounts", or the account you're actively staking with, selected in the top
          right of the navigation bar.
        </Text.Body>
      ),
    },
    {
      summary: 'How does Talisman pick which pool to enter?',
      content: (
        <Text.Body>
          Talisman surveys the available pools at the time of staking, returning a recommendation based on the pool's
          selection of validators, a verified identity, history of actively earning rewards, and not{' '}
          <Text.A href="https://wiki.polkadot.network/docs/learn-nomination-pools#slashing" target="_blank">
            being slashed
          </Text.A>{' '}
          for harmful behaviour.
        </Text.Body>
      ),
    },
  ]

  const [expandedFaq, setExpandedFaq] = useState<number>()

  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
      {faqs.map((faq, index) => (
        <Details
          key={faq.summary}
          open={index === expandedFaq}
          onToggle={value => {
            setExpandedFaq(prev => (prev === index ? undefined : index))
          }}
          {...faq}
        />
      ))}
    </div>
  )
}

const PoolSelector = (props: {
  open: boolean
  selectedPoolId?: number
  onChangePoolId: (poolId: number) => unknown
  onDismiss: () => unknown
}) => {
  const [newPoolId, setNewPoolId] = useState<number>()
  const [recommendedPools, nativeTokenDecimal, currentChain] = useRecoilValue(
    waitForAll([recommendedPoolsState, nativeTokenDecimalState, chainState])
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
      {recommendedPools.map((pool, index) => (
        <PoolSelectorDialog.Item
          selected={props.selectedPoolId !== undefined && pool.poolId === props.selectedPoolId}
          highlighted={newPoolId !== undefined && pool.poolId === newPoolId}
          talismanRecommended={index === 0}
          poolName={pool.name ?? ''}
          poolDetailUrl={
            currentChain.subscanUrl === null
              ? undefined
              : new URL(`nomination_pool/${pool.poolId}`, currentChain.subscanUrl).toString()
          }
          stakedAmount={`${nativeTokenDecimal.fromAtomics(pool.bondedPool.points).toHuman()} staked`}
          rating={3}
          memberCount={pool.bondedPool.memberCounter.toString()}
          onClick={() => setNewPoolId(pool.poolId)}
        />
      ))}
    </PoolSelectorDialog>
  )
}

const Input = () => {
  // TODO: remove
  const nomsPoolCountDown = useCountDownToNomsPool()
  const theme = useTheme()

  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')
  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra')

  const location = useLocation()

  const poolIdFromSearch = useMemo(
    () =>
      Maybe.of(new URLSearchParams(location.search).get('poolId')).mapOrUndefined(x => {
        try {
          return parseInt(x)
        } catch {}
      }),
    [location.search]
  )

  const [api, accounts, recommendedPools] = useRecoilValue(
    waitForAll([apiState, polkadotAccountsState, recommendedPoolsState])
  )

  const initialPoolId = poolIdFromSearch ?? recommendedPools[0]?.poolId

  const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId)
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
  } = usePoolAddForm('join', selectedAccount?.address)

  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  const activeEraLoadable = useChainState('query', 'staking', 'activeEra', [])
  const eraStakersLoadable = useRecoilValueLoadable(
    activeEraLoadable.state !== 'hasValue'
      ? constSelector(undefined)
      : eraStakersState(activeEraLoadable.contents.unwrapOrDefault().index)
  ).map(value => new Set(value?.map(x => x[0].args[1].toHuman())))

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators',
    [selectedPoolId === undefined ? '' : createAccounts(api, new BN(selectedPoolId)).stashId],
    { enabled: selectedPoolId !== undefined }
  )

  const poolStatus = useMemo<PoolStatus | undefined>(() => {
    if (eraStakersLoadable.state !== 'hasValue' || poolNominatorsLoadable.state !== 'hasValue') {
      return
    }

    if (poolNominatorsLoadable.contents.unwrapOrDefault().targets.length === 0) {
      return 'not_nominating'
    }

    return poolNominatorsLoadable.contents
      .unwrapOrDefault()
      .targets.some(x => eraStakersLoadable.contents.has(x.toHuman()))
      ? 'earning_rewards'
      : 'waiting'
  }, [
    eraStakersLoadable.contents,
    eraStakersLoadable.state,
    poolNominatorsLoadable.contents,
    poolNominatorsLoadable.state,
  ])

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
    setSelectedPoolId(initialPoolId)
  }, [initialPoolId, recommendedPools])

  return (
    <>
      <PoolSelector
        open={showPoolSelector}
        selectedPoolId={selectedPoolId}
        onChangePoolId={setSelectedPoolId}
        onDismiss={useCallback(() => setShowPoolSelector(false), [])}
      />
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
          poolName={poolMetadataLoadable.valueMaybe()?.toUtf8() ?? ''}
          poolStatus={poolStatus}
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
              joinPoolExtrinsic.signAndSend(selectedAccount.address, decimalAmount.atomics.toString(), selectedPoolId)
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
    </>
  )
}

const Staking = () => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '6.4rem 1.8rem 1.8rem 1.8rem',
      }}
    >
      <div
        css={{
          '@media (min-width: 768px)': {
            width: '86rem',
          },
        }}
      >
        <Suspense
          fallback={
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
                text={<CircularProgressIndicator size="1em" />}
                supportingText={<CircularProgressIndicator size="1em" />}
              />
              <InfoCard
                headlineText="Staking"
                text={<CircularProgressIndicator size="1em" />}
                supportingText={<CircularProgressIndicator size="1em" />}
              />
              <InfoCard headlineText="Rewards" text={<CircularProgressIndicator size="1em" />} />
              <InfoCard
                headlineText="Unstaking"
                text={<CircularProgressIndicator size="1em" />}
                supportingText={<CircularProgressIndicator size="1em" />}
              />
            </div>
          }
        >
          <Statistics />
        </Suspense>
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
            <Suspense fallback={<StakingInput.Skeleton />}>
              <Input />
            </Suspense>
          </div>
          <Faq />
        </div>
      </div>
    </div>
  )
}

export default Staking
