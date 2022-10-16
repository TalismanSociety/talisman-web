import Details from '@components/molecules/Details'
import InfoCard from '@components/molecules/InfoCard'
import StakingInput from '@components/recipes/StakingInput'
import { nativeTokenDecimalState } from '@domains/chains/recoils'
import useChainState from '@domains/common/hooks/useChainState'
import { accountsState } from '@domains/extension/recoils'
import { useState } from 'react'
import { useRecoilValue } from 'recoil'

const Staking = () => {
  const accounts = useRecoilValue(accountsState)
  const nativeTokenDecimal = useRecoilValue(nativeTokenDecimalState)

  const [amount, setAmount] = useState('')

  const [selectedAccount, setSelectedAccount] = useState<typeof accounts[number] | undefined>(accounts[0])

  const balancesLoadable = useChainState('derive', 'balances', 'all', [selectedAccount?.address ?? ''], {
    enabled: selectedAccount !== undefined,
  })

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
              accounts={accounts.map(x => ({
                ...x,
                selected: x.address === selectedAccount?.address,
                name: x.name ?? x.address,
                balance: '',
              }))}
              onSelectAccount={x => setSelectedAccount(accounts.find(account => account.address === x.address)!)}
              amount={amount}
              fiatAmount="$4,261.23"
              onChangeAmount={setAmount}
              onRequestMaxAmount={() => {}}
              availableToStake={
                balancesLoadable.state === 'hasValue'
                  ? nativeTokenDecimal(balancesLoadable.contents.freeBalance).toHuman()
                  : '...'
              }
              poolName="Bingbong pool"
              poolTotalStaked="24,054.55 DOT"
              poolMemberCount="17"
              onSubmit={() => {}}
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
