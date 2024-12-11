import { Outlet } from 'react-router'
import { useRecoilValue } from 'recoil'

import { WalletTotal } from '@/components/legacy/widgets/WalletTotal'
import { PageHeader, PageHeaderItem } from '@/components/molecules/PageHeader'
import { PageTab, PageTabs } from '@/components/molecules/PageTabs'
import { AccountValueInfo } from '@/components/recipes/AccountValueInfo'
import { PortfolioAddressSearch } from '@/components/recipes/PortfolioAddressSearch'
import { AccountsManagementMenu } from '@/components/widgets/AccountsManagementMenu'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { selectedAccountsState } from '@/domains/accounts/recoils'

const Layout = () => {
  const accounts = useRecoilValue(selectedAccountsState)

  return (
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
            <PageTab to="/portfolio" end>
              Overview
            </PageTab>
            <PageTab to="/portfolio/assets">Tokens</PageTab>
            <PageTab to="/portfolio/collectibles">NFTs</PageTab>
          </PageTabs>
        </PageHeaderItem>

        <PageHeaderItem>
          <PortfolioAddressSearch />
        </PageHeaderItem>
      </PageHeader>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  )
}

export default Layout
