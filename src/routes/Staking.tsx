import Details from '@components/molecules/Details'
import InfoCard from '@components/molecules/InfoCard'
import StakingInput from '@components/recipes/StakingInput'
import { nativeTokenDecimalState } from '@domains/chains/recoils'
import { useTokenAmountState } from '@domains/common/hooks'
import useChainState from '@domains/common/hooks/useChainState'
import useExtrinsic from '@domains/common/hooks/useExtrinsic'
import { accountsState } from '@domains/extension/recoils'
import { useEffect, useMemo, useState } from 'react'
import { useRecoilValue, waitForAll } from 'recoil'

const Staking = () => {
  const joinPoolExtrinsic = useExtrinsic('nominationPools', 'join')
  const bondExtraExtrtinsic = useExtrinsic('nominationPools', 'bondExtra')

  const [accounts, nativeTokenDecimal] = useRecoilValue(waitForAll([accountsState, nativeTokenDecimalState]))

  const [{ amount, decimalAmount, localizedFiatAmount }, setAmount] = useTokenAmountState('')

  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number] | undefined>(accounts[0])

  const balancesLoadable = useChainState('derive', 'balances', 'all', [selectedAccount?.address ?? ''], {
    enabled: selectedAccount !== undefined,
  })
  const poolMembersLoadable = useChainState('query', 'nominationPools', 'poolMembers', [selectedAccount?.address!], {
    enabled: selectedAccount?.address !== undefined,
  })

  const bondedPoolLoadable = useChainState(
    'query',
    'nominationPools',
    'bondedPools',
    [poolMembersLoadable.valueMaybe()?.unwrapOrDefault().poolId ?? ''],
    { enabled: poolMembersLoadable.valueMaybe()?.isSome === true }
  )

  const poolTotalStaked = useMemo(
    () => nativeTokenDecimal.fromAtomics(poolMembersLoadable.valueMaybe()?.unwrapOrDefault().points).toHuman(),
    [nativeTokenDecimal, poolMembersLoadable]
  )

  const poolMetadata = useChainState(
    'query',
    'nominationPools',
    'metadata',
    [poolMembersLoadable.valueMaybe()?.unwrapOrDefault().poolId ?? ''],
    {
      enabled: poolMembersLoadable.valueMaybe()?.isSome === true,
    }
  )

  const hasExistingPool = poolMembersLoadable.valueMaybe()?.isSome === true

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
          <InfoCard headlineText="Staking" text="0 DOT" supportingText="$0.00" />
          <InfoCard headlineText="Rewards" text="17.56% APR" />
          <InfoCard headlineText="Unstaking" text="0 DOT" supportingText="$0.00" />
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
              poolName={poolMetadata.valueMaybe()?.toUtf8() ?? ''}
              poolTotalStaked={poolTotalStaked}
              poolMemberCount={bondedPoolLoadable.valueMaybe()?.unwrapOrDefault().memberCounter.toString() ?? ''}
              onSubmit={() => {
                if (selectedAccount === undefined || decimalAmount?.atomics === undefined) return
                if (hasExistingPool) {
                  bondExtraExtrtinsic.signAndSend(selectedAccount.address, {
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
