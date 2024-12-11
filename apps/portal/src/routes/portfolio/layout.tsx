import { Tabs } from '@talismn/ui/molecules/Tabs'
import { Outlet } from 'react-router'
import { Link, useMatch } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { WalletTotal } from '@/components/legacy/widgets/WalletTotal'
import { AccountValueInfo } from '@/components/recipes/AccountValueInfo'
import { PortfolioAddressSearch } from '@/components/recipes/PortfolioAddressSearch'
import { AccountsManagementMenu } from '@/components/widgets/AccountsManagementMenu'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'
import { selectedAccountsState } from '@/domains/accounts/recoils'

const Layout = () => {
  // useMatch
  const paths = [
    { path: '', name: 'Overview' },
    { path: 'collectibles', name: 'Collectibles' },
  ]

  // get the current path that is after /portfolio/ even if there is something after it
  const currentPath = useMatch('/portfolio/:id/*')?.params.id ?? paths[0]?.path

  const accounts = useRecoilValue(selectedAccountsState)

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <AccountsManagementMenu
            button={
              <AccountValueInfo account={accounts.length === 1 ? accounts[0] : undefined} balance={<WalletTotal />} />
            }
          />
        </div>
        <nav className="flex list-none items-center">
          <li>Overview</li>
          <li>Tokens</li>
          <li>NFTs</li>
        </nav>
        <PortfolioAddressSearch />
      </div>
      <Tabs>
        {paths.map(path => (
          <Tabs.Item key={path.path} as={Link} to={path.path} selected={path.path === currentPath}>
            {path.name}
          </Tabs.Item>
        ))}
      </Tabs>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  )
}

export default Layout
