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
import { cn } from '@/util/cn'

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
      <div className={cn('flex flex-col items-center justify-stretch', 'lg:flex-row lg:justify-between')}>
        <div className="flex-1">
          <AccountsManagementMenu
            button={
              <AccountValueInfo account={accounts.length === 1 ? accounts[0] : undefined} balance={<WalletTotal />} />
            }
          />
        </div>
        <nav className="flex flex-1 list-none items-center justify-center gap-4">
          <li>Overview</li>
          <li>Tokens</li>
          <li>NFTs</li>
        </nav>
        <div className="flex flex-1 items-center justify-end">
          <PortfolioAddressSearch />
        </div>
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
