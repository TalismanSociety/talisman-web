import { Surface } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { WalletTotal } from '@/components/legacy/widgets/WalletTotal'
import { PageHeader, PageHeaderItem } from '@/components/molecules/PageHeader'
import { PageTab, PageTabs } from '@/components/molecules/PageTabs'
import { AccountValueInfo } from '@/components/recipes/AccountValueInfo'
import { PortfolioAddressSearch } from '@/components/recipes/PortfolioAddressSearch'
import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { AccountsManagementMenu } from '@/components/widgets/AccountsManagementMenu'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { selectedAccountsState } from '@/domains/accounts/recoils'
import { useTotalStaked } from '@/domains/staking/hooks'

const TotalStaked = () => <AnimatedFiatNumber end={useTotalStaked()} />

const Layout = () => {
  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <AccountConnectionGuard>
      <div className="flex w-full flex-col gap-8">
        <PageHeader>
          <PageHeaderItem>
            <AccountsManagementMenu
              button={
                <AccountValueInfo account={accounts.length === 1 ? accounts[0] : undefined} balance={<WalletTotal />} />
              }
            />
          </PageHeaderItem>

          <PageHeaderItem>
            <PageTabs>
              <PageTab to="/staking/providers">Stake</PageTab>
              <PageTab to="/staking/positions">Positions</PageTab>
            </PageTabs>
          </PageHeaderItem>

          <PageHeaderItem>
            <PortfolioAddressSearch />
            <div>
              <Text.BodyLarge as="div">Staking balance</Text.BodyLarge>
              <Text.H3 as="div" css={{ marginTop: '0.125em' }}>
                <TotalStaked />
              </Text.H3>
            </div>
          </PageHeaderItem>
        </PageHeader>
        <Surface css={{ borderRadius: '1.6rem', padding: '1.6rem' }}>
          <Outlet />
        </Surface>
      </div>
    </AccountConnectionGuard>
  )
}

export default Layout
