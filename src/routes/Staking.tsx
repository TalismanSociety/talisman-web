import Details from '@components/molecules/Details'
import InfoCard from '@components/molecules/InfoCard'
import StakingInput from '@components/recipes/StakingInput'
import { nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountFromAtomics, useTokenAmountState } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { accountsState } from '@domains/extension/recoils'
import { BN } from '@polkadot/util'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const Staking = () => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')
  const bondExtraExtrinsic = useExtrinsic('nominationPools', 'bondExtra')

  const [accounts, nativeTokenDecimal] = useRecoilValue(waitForAll([accountsState, nativeTokenDecimalState]))

  const [{ amount, decimalAmount, localizedFiatAmount }, setAmount] = useTokenAmountState('')

  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number] | undefined>(accounts[0])
  const selectedAccountIndex = useMemo(
    () => accounts.findIndex(({ address }) => address === selectedAccount?.address),
    [accounts, selectedAccount?.address]
  )

  const balancesLoadable = useChainState('derive', 'balances', 'all', [selectedAccount?.address ?? ''], {
    enabled: selectedAccount !== undefined,
  })

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

  const selectedPoolId = 1

  const bondedPoolLoadable = useChainState('query', 'nominationPools', 'bondedPools', [selectedPoolId])

  const { decimalAmount: poolTotalStaked } = useTokenAmountFromAtomics(
    bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().points
  )

  const poolMetadataLoadable = useChainState('query', 'nominationPools', 'metadata', [selectedPoolId])

  const hasExistingPool = poolMembersLoadable.valueMaybe()?.[selectedAccountIndex]?.isSome === true

  const isReady =
    selectedAccount !== undefined &&
    decimalAmount !== undefined &&
    poolMembersLoadable.state === 'hasValue' &&
    balancesLoadable.state === 'hasValue'

  useEffect(() => {
    if (selectedAccount === undefined && accounts.length > 0) {
      setSelectedAccount(accounts[0])
    }
  }, [accounts, selectedAccount])

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
              onSelectAccount={x => setSelectedAccount(accounts.find(account => account.address === x.address)!)}
              amount={amount}
              fiatAmount={localizedFiatAmount ?? ''}
              onChangeAmount={setAmount}
              onRequestMaxAmount={() => {
                if (balancesLoadable.state === 'hasValue') {
                  setAmount(nativeTokenDecimal.fromAtomics(balancesLoadable.contents.freeBalance).toString())
                }
              }}
              availableToStake={
                balancesLoadable.state === 'hasValue'
                  ? nativeTokenDecimal.fromAtomics(balancesLoadable.contents.freeBalance).toHuman()
                  : '...'
              }
              poolName={poolMetadataLoadable.valueMaybe()?.toUtf8() ?? ''}
              poolTotalStaked={poolTotalStaked?.toHuman() ?? ''}
              poolMemberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
              onSubmit={() => {
                if (selectedAccount === undefined || decimalAmount?.atomics === undefined) return
                if (hasExistingPool) {
                  bondExtraExtrinsic.signAndSend(selectedAccount.address, {
                    FreeBalance: decimalAmount.atomics.toString(),
                  })
                } else {
                  joinPoolExtrinsic.signAndSend(selectedAccount.address, decimalAmount.atomics.toString(), 1)
                }
              }}
              submitState={useMemo(() => {
                if (!isReady) return 'disabled'

                return joinPoolExtrinsic.state === 'loading' ? 'pending' : undefined
              }, [isReady, joinPoolExtrinsic.state])}
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
