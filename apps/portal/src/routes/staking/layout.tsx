import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { SegmentedButton } from '@talismn/ui/molecules/SegmentedButton'
import { Layers, Zap } from '@talismn/web-icons'
import { useMemo } from 'react'
import { Link, Outlet, useMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { WalletTotal } from '@/components/legacy/widgets/WalletTotal'
import { AccountValueInfo } from '@/components/recipes/AccountValueInfo'
import { PortfolioAddressSearch } from '@/components/recipes/PortfolioAddressSearch'
import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { AccountsManagementMenu } from '@/components/widgets/AccountsManagementMenu'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { selectedAccountsState } from '@/domains/accounts/recoils'
import { useTotalStaked } from '@/domains/staking/hooks'

const TotalStaked = () => <AnimatedFiatNumber end={useTotalStaked()} />

const Layout = () => {
  const positionsMatch = useMatch('/staking/positions')
  const providersMatch = useMatch('/staking/providers')

  const currentPath = useMemo(
    () => (positionsMatch?.pathname ?? providersMatch?.pathname)?.split('/').at(-1),
    [positionsMatch?.pathname, providersMatch?.pathname]
  )

  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <AccountConnectionGuard>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AccountsManagementMenu
              button={
                <AccountValueInfo account={accounts.length === 1 ? accounts[0] : undefined} balance={<WalletTotal />} />
              }
            />
            <div>
              <Text.BodyLarge as="div">Staking balance</Text.BodyLarge>
              <Text.H3 as="div" css={{ marginTop: '0.125em' }}>
                <TotalStaked />
              </Text.H3>
            </div>
          </div>
          <PortfolioAddressSearch />
        </div>
        <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
          <SegmentedButton value={currentPath} css={{ marginBottom: '2.4rem' }}>
            <Link to="providers">
              <SegmentedButton.ButtonSegment value="providers" leadingIcon={<Zap />}>
                Stake
              </SegmentedButton.ButtonSegment>
            </Link>
            <Link to="positions">
              <SegmentedButton.ButtonSegment value="positions" leadingIcon={<Layers />}>
                Positions
              </SegmentedButton.ButtonSegment>
            </Link>
          </SegmentedButton>
          <Outlet />
        </Surface>
      </div>
    </AccountConnectionGuard>
  )
}

export default Layout
