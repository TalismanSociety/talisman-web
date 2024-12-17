import { CircularProgressIndicator } from '@talismn/ui/atoms/CircularProgressIndicator'
import { TalismanHandProgressIndicator } from '@talismn/ui/atoms/TalismanHandProgressIndicator'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { Suspense, useTransition } from 'react'
import { Outlet } from 'react-router-dom'

import { PageHeader, PageHeaderItem } from '@/components/molecules/PageHeader'
import { PageTab, PageTabs } from '@/components/molecules/PageTabs'
import { AccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { ErrorBoundary } from '@/components/widgets/ErrorBoundary'

const Layout = () => {
  const [pending] = useTransition()

  return (
    <AccountConnectionGuard>
      <div className="flex w-full flex-col gap-8">
        <PageHeader>
          <PageHeaderItem className="justify-center">
            <PageTabs>
              <PageTab to="/transport/swap">Cross Chain Swap</PageTab>
              <PageTab to="/transport/xcm">Polkadot XCM</PageTab>
            </PageTabs>
          </PageHeaderItem>
        </PageHeader>

        <ErrorBoundary>
          <Suspense fallback={<TalismanHandProgressIndicator />}>
            <div className="mx-auto w-full max-w-[840px]">
              <div className="w-full pb-[40px]">
                <HiddenDetails overlay={<CircularProgressIndicator size="4em" />} hidden={pending}>
                  <Outlet />
                </HiddenDetails>
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>
    </AccountConnectionGuard>
  )
}

export default Layout
