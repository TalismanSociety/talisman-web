import { Text } from '@talismn/ui/atoms/Text'
import { SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR } from '@talismn/ui/organisms/Scaffold'
import { createPortal } from '@talismn/ui/utils-react/portal'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { WalletTotal } from '@/components/legacy/widgets/WalletTotal'
import { AddressSearch } from '@/components/molecules/AddressSearch'
import { CurrencySelect } from '@/components/molecules/CurrencySelect'
import { WalletConnectionButton } from '@/components/molecules/WalletConnectionButton'
import { AccountValueInfo } from '@/components/recipes/AccountValueInfo'
import { useShouldShowAccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'
import { AccountsManagementMenu } from '@/components/widgets/AccountsManagementMenu'
import { selectedAccountsState } from '@/domains/accounts/recoils'

const PATHS_TO_EXCLUDE_ACCOUNTS_MENU = ['/transport']

const [TitlePortalProvider, TitlePortal, TitlePortalElement] = createPortal()
export { TitlePortal, TitlePortalProvider }

const [HeaderWidgetPortalProvider, HeaderWidgetPortal, HeaderWidgetPortalElement] = createPortal()
export { HeaderWidgetPortal, HeaderWidgetPortalProvider }

export const PageHeader = () => {
  const shouldShowAccountConnectionGuard = useShouldShowAccountConnectionGuard()
  const accounts = useRecoilValue(selectedAccountsState)
  const location = useLocation()

  const shouldExcludeAccountsManagementMenu = useMemo(() => {
    return PATHS_TO_EXCLUDE_ACCOUNTS_MENU.find(e => location.pathname.toLowerCase().startsWith(e.toLowerCase()))
  }, [location.pathname])

  if (shouldShowAccountConnectionGuard) {
    return null
  }

  return (
    <div css={{ marginBottom: '0.8rem' }}>
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap-reverse',
          gap: '0.8rem',
          marginTop: '2.4rem',
          marginBottom: '0.8rem',
        }}
      >
        <Text.H2 css={{ marginBottom: 0 }}>
          <TitlePortalElement />
        </Text.H2>
        <div css={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', flexWrap: 'wrap' }}>
          <AddressSearch />
          <CurrencySelect />
          <div css={{ display: 'none', [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: { display: 'contents' } }}>
            <WalletConnectionButton />
          </div>
        </div>
      </div>
      <div css={{ display: 'flex', gap: '2.4rem', flexWrap: 'wrap' }}>
        {!shouldExcludeAccountsManagementMenu && (
          <AccountsManagementMenu
            button={
              <AccountValueInfo account={accounts.length === 1 ? accounts[0] : undefined} balance={<WalletTotal />} />
            }
          />
        )}
        <HeaderWidgetPortalElement />
      </div>
    </div>
  )
}
