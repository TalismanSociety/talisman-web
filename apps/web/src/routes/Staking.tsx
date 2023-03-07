import PoolStakeItem from '@archetypes/NominationPools/PoolStakeItem'
import PoolExitingInProgress from '@components/recipes/PoolExitingInProgress'
import PoolSelectorDialog from '@components/recipes/PoolSelectorDialog'
import { PoolStatus } from '@components/recipes/PoolStatusIndicator'
import StakingInput from '@components/recipes/StakingInput'
import { injectedAccountsState, injectedSubstrateAccountsState } from '@domains/accounts/recoils'
import { apiState, chainState, nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountFromPlanck } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { chainReadIdState } from '@domains/common/recoils'
import { useInflation, usePoolAddForm } from '@domains/nominationPools/hooks'
import { allPendingPoolRewardsState, eraStakersState, recommendedPoolsState } from '@domains/nominationPools/recoils'
import { createAccounts } from '@domains/nominationPools/utils'
import { BN } from '@polkadot/util'
import { CircularProgressIndicator, Details, InfoCard, Text } from '@talismn/ui'
import { shortenAddress } from '@util/format'
import { Maybe } from '@util/monads'
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  atom,
  constSelector,
  selector,
  useRecoilState,
  useRecoilValue,
  useRecoilValueLoadable,
  waitForAll,
} from 'recoil'

const availableToStakeState = selector({
  key: 'Staking/AvailableToStake',
  get: async ({ get }) => {
    get(chainReadIdState)

    const api = get(apiState)
    const accounts = get(injectedAccountsState)

    const balances = await Promise.all(accounts.map(({ address }) => api.derive.balances.all(address)))

    return balances.reduce(
      (prev, curr) => BN.max(new BN(0), curr.availableBalance.sub(api.consts.balances.existentialDeposit)).add(prev),
      new BN(0)
    )
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

const Statistics = () => {
  const accounts = useRecoilValue(injectedSubstrateAccountsState)
  const poolMembersLoadable = useChainState(
    'query',
    'nominationPools',
    'poolMembers.multi',
    accounts.map(({ address }) => address),
    {
      enabled: accounts.length > 0,
    }
  )

  const availableToStake = useTokenAmountFromPlanck(useRecoilValueLoadable(availableToStakeState).valueMaybe())

  const totalStaked = useTokenAmountFromPlanck(
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

  const totalUnstaking = useTokenAmountFromPlanck(
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

const Faq = (props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
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
          Your real reward rate is dependent on these variable rates, and any commission earnt by validators selected by
          the pool. You may consult the URL in the name of your pool for information.
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
    <div {...props}>
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
          key={pool.poolId}
          selected={props.selectedPoolId !== undefined && pool.poolId === props.selectedPoolId}
          highlighted={newPoolId !== undefined && pool.poolId === newPoolId}
          talismanRecommended={index === 0}
          poolName={pool.name ?? ''}
          poolDetailUrl={
            currentChain.subscanUrl === null
              ? undefined
              : new URL(`nomination_pool/${pool.poolId}`, currentChain.subscanUrl).toString()
          }
          stakedAmount={`${nativeTokenDecimal.fromPlanck(pool.bondedPool.points).toHuman()} staked`}
          rating={3}
          memberCount={pool.bondedPool.memberCounter.toString()}
          onClick={() => setNewPoolId(pool.poolId)}
        />
      ))}
    </PoolSelectorDialog>
  )
}

const selectedAccountState = atom({
  key: 'Page/Staking/SelectedAccount',
  default: selector({
    key: 'Page/Staking/SelectedAccount/Default',
    get: ({ get }) => get(injectedSubstrateAccountsState)[0],
  }),
})

const Input = () => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')

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

  const [api, accounts, recommendedPools, pendingRewards] = useRecoilValue(
    waitForAll([apiState, injectedSubstrateAccountsState, recommendedPoolsState, allPendingPoolRewardsState])
  )

  const initialPoolId = poolIdFromSearch ?? recommendedPools[0]?.poolId

  const [selectedPoolId, setSelectedPoolId] = useState(initialPoolId)
  const [showPoolSelector, setShowPoolSelector] = useState(false)

  const [selectedAccount, setSelectedAccount] = useRecoilState(selectedAccountState)
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

  const existingPool =
    poolMembersLoadable.state === 'hasValue' && poolMembersLoadable.contents[selectedAccountIndex]?.isSome
      ? poolMembersLoadable.contents[selectedAccountIndex]!.unwrap()
      : undefined

  const poolNominatorsLoadable = useChainState(
    'query',
    'staking',
    'nominators.multi',
    existingPool === undefined
      ? [createAccounts(api, new BN(selectedPoolId ?? 0)).stashId]
      : [
          createAccounts(api, new BN(selectedPoolId ?? 0)).stashId,
          createAccounts(api, new BN(existingPool.poolId ?? 0)).stashId,
        ],
    { enabled: selectedPoolId !== undefined }
  )

  const [poolStatus, existingPoolStatus] = useMemo<readonly [PoolStatus | undefined, PoolStatus | undefined]>(() => {
    if (eraStakersLoadable.state !== 'hasValue' || poolNominatorsLoadable.state !== 'hasValue') {
      return [undefined, undefined]
    }

    if (poolNominatorsLoadable.contents[0]?.unwrapOrDefault().targets.length === 0) {
      return ['not_nominating', undefined]
    }

    return [
      poolNominatorsLoadable.contents[0]
        ?.unwrapOrDefault()
        .targets.some(x => eraStakersLoadable.contents.has(x.toHuman()))
        ? 'earning_rewards'
        : 'waiting',
      poolNominatorsLoadable.contents[1]
        ?.unwrapOrDefault()
        .targets.some(x => eraStakersLoadable.contents.has(x.toHuman()))
        ? 'earning_rewards'
        : 'waiting',
    ] as const
  }, [
    eraStakersLoadable.contents,
    eraStakersLoadable.state,
    poolNominatorsLoadable.contents,
    poolNominatorsLoadable.state,
  ])

  const bondedPoolLoadable = useChainState('query', 'nominationPools', 'bondedPools', [selectedPoolId!], {
    enabled: selectedPoolId !== undefined,
  })

  const { decimalAmount: poolTotalStaked } = useTokenAmountFromPlanck(
    bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().points
  )

  const poolMetadataLoadable = useChainState(
    'query',
    'nominationPools',
    'metadata.multi',
    existingPool === undefined
      ? [selectedPoolId!]
      : selectedPoolId === undefined
      ? [existingPool.poolId, existingPool.poolId]
      : [selectedPoolId!, existingPool.poolId],
    {
      enabled: selectedPoolId !== undefined || existingPool !== undefined,
    }
  )

  const isReady =
    selectedAccount !== undefined &&
    decimalAmount !== undefined &&
    poolMembersLoadable.state === 'hasValue' &&
    isInputReady

  useEffect(() => {
    if (selectedAccount === undefined && accounts.length > 0) {
      setSelectedAccount(accounts[0])
    }
  }, [accounts, selectedAccount, setSelectedAccount])

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
      <motion.div
        initial="false"
        animate={String(existingPool !== undefined)}
        variants={{
          true: { transition: { staggerChildren: 0.35 } },
        }}
      >
        <div css={{ position: 'relative', zIndex: 1 }}>
          <StakingInput
            alreadyStaking={existingPool !== undefined}
            accounts={useMemo(
              () =>
                accounts.map(x => ({
                  ...x,
                  selected: x.address === selectedAccount?.address,
                  name: x.name ?? shortenAddress(x.address),
                  balance: '',
                })),
              [accounts, selectedAccount?.address]
            )}
            onSelectAccount={useCallback(
              x => setSelectedAccount(accounts.find(account => account.address === x.address)!),
              [accounts, setSelectedAccount]
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
            poolName={poolMetadataLoadable.valueMaybe()?.[0]?.toUtf8() ?? ''}
            poolStatus={poolStatus}
            poolTotalStaked={poolTotalStaked?.toHuman() ?? ''}
            poolMemberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
            onRequestPoolChange={useCallback(() => setShowPoolSelector(true), [])}
            onSubmit={useCallback(() => {
              if (
                selectedAccount !== undefined &&
                decimalAmount?.planck !== undefined &&
                selectedPoolId !== undefined
              ) {
                joinPoolExtrinsic.signAndSend(selectedAccount.address, decimalAmount.planck.toString(), selectedPoolId)
              }
            }, [decimalAmount?.planck, joinPoolExtrinsic, selectedAccount, selectedPoolId])}
            submitState={useMemo(() => {
              if (!isReady || inputError !== undefined || decimalAmount.planck.isZero()) return 'disabled'

              return joinPoolExtrinsic.state === 'loading' ? 'pending' : undefined
            }, [decimalAmount?.planck, inputError, isReady, joinPoolExtrinsic.state])}
            contentAnimation={{
              variants: {
                true: { height: 0 },
                false: { height: 'unset' },
              },
            }}
          />
        </div>
        <motion.div
          css={{ marginTop: '1.6rem', overflow: 'hidden' }}
          variants={{
            true: { opacity: 1, scale: 1 },
            false: { opacity: 0, scale: 0.8 },
          }}
        >
          {existingPool !== undefined &&
            (existingPool.points.isZero() ? (
              <PoolExitingInProgress />
            ) : (
              <PoolStakeItem
                variant="compact"
                item={{
                  status: existingPoolStatus,
                  account: selectedAccount,
                  poolName: poolMetadataLoadable.valueMaybe()?.[1]?.toUtf8() ?? '',
                  poolMember: existingPool,
                  pendingRewards: pendingRewards.find(x => x[0] === selectedAccount?.address)?.[1],
                }}
              />
            ))}
        </motion.div>
      </motion.div>
    </>
  )
}

const Staking = () => (
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
          width: '80rem',
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
          'display': 'flex',
          'flexDirection': 'column',
          'gap': '5.5rem',
          '@media (min-width: 768px)': {
            flexDirection: 'row',
            gap: '1.6rem',
          },
        }}
      >
        <div
          css={{
            flex: 1,
            // Combine with flex 1 so child doesn't expand parent
            minWidth: 0,
          }}
        >
          <Suspense fallback={<StakingInput.Skeleton />}>
            <Input />
          </Suspense>
        </div>
        <Faq
          css={{
            flex: 1,
            // Combine with flex 1 so child doesn't expand parent
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.6rem',
          }}
        />
      </div>
    </div>
  </div>
)

export default Staking
