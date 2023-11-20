import { useTheme } from '@emotion/react'
import { ChevronLeft } from '@talismn/icons'
import { Button, IconButton } from '@talismn/ui'
import { useNavigate } from 'react-router-dom'

import { Layout } from '../Layout'
import { AccountDetails } from '@components/AddressInput/AccountDetails'
import { useSelectedMultisig } from '@domains/multisig'
import { SettingsInfoRow } from '../Settings/InfoRow'
import { BalanceCard } from './BalanceCard'
import NominationPoolOverview from './NominationPoolOverview'
import { useAugmentedBalances } from '../../domains/balances'
import { useNativeToken } from '../../domains/chains'
import { usePoolMembership } from '../../domains/staking/usePoolMembership'

export const BackButton = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Button
      css={{ height: '32px', width: '78px', marginBottom: '56px', padding: '8px' }}
      variant="secondary"
      onClick={() => {
        navigate('/settings')
      }}
    >
      <div css={{ display: 'flex', gap: '4px' }}>
        <IconButton as={'div'} size={16} contentColor={`rgb(${theme.dim})`}>
          <ChevronLeft size={16} />
        </IconButton>
        <span css={{ fontSize: '16px', color: 'var(--color-dim)' }}>Back</span>
      </div>
    </Button>
  )
}

const Staking = () => {
  const [multisig] = useSelectedMultisig()
  const { nativeToken } = useNativeToken(multisig.chain.nativeToken.id)
  const { membership } = usePoolMembership(multisig.proxyAddress, multisig.chain)

  const augmentedTokens = useAugmentedBalances()
  const balance = augmentedTokens.find(({ details }) => details.id === multisig.chain.nativeToken.id)

  // total staked funds
  const locksStaking = balance?.balanceDetails.locks.find(({ label }) => label === 'staking')
  const stakingAmount = balance === undefined ? undefined : +(locksStaking?.amount.tokens ?? 0)

  // total funds in pool
  const pooledAmount = membership?.balance.toHuman().split(' ')[0]

  return (
    <Layout selected="Staking" requiresMultisig>
      <div css={{ display: 'flex', flex: 1, padding: '32px 8%', flexDirection: 'column', gap: 32 }}>
        <h2 css={({ color }) => ({ color: color.offWhite, marginTop: 4 })}>Staking Overview</h2>
        <div css={{ display: 'flex', gap: 32, width: '100%' }}>
          {/** second row: Proxied Account */}
          <div css={{ width: '100%' }}>
            <SettingsInfoRow label="Account">
              <AccountDetails address={multisig.proxyAddress} chain={multisig.chain} />
            </SettingsInfoRow>
          </div>
          <div css={{ display: 'grid', gap: 12, width: '100%' }}>
            <BalanceCard
              symbol={nativeToken?.symbol}
              amount={balance?.balance.avaliable}
              price={balance?.price}
              label="Available"
            />
            <BalanceCard symbol={nativeToken?.symbol} amount={stakingAmount} price={balance?.price} label="Staked" />
            <BalanceCard
              symbol={nativeToken?.symbol}
              amount={membership === undefined ? undefined : +(pooledAmount ?? '0')}
              price={balance?.price}
              label="In Pool"
            />
          </div>
          <div />
        </div>
        <NominationPoolOverview />
      </div>
    </Layout>
  )
}
export default Staking
