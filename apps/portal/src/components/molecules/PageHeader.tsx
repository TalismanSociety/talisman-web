import { Text } from '@talismn/ui/atoms/Text'
import { SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR } from '@talismn/ui/organisms/Scaffold'
import { createPortal } from '@talismn/ui/utils-react/portal'

import { CurrencySelect } from '@/components/molecules/CurrencySelect'
import { WalletConnectionButton } from '@/components/molecules/WalletConnectionButton'
import { useShouldShowAccountConnectionGuard } from '@/components/widgets/AccountConnectionGuard'

const [TitlePortalProvider, TitlePortal, TitlePortalElement] = createPortal()
export { TitlePortal, TitlePortalProvider }

const [HeaderWidgetPortalProvider, HeaderWidgetPortal, HeaderWidgetPortalElement] = createPortal()
export { HeaderWidgetPortal, HeaderWidgetPortalProvider }

export const PageHeader = () => {
  const shouldShowAccountConnectionGuard = useShouldShowAccountConnectionGuard()

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
          <CurrencySelect />
          <div css={{ display: 'none', [SCAFFOLD_WIDE_VIEW_MEDIA_SELECTOR]: { display: 'contents' } }}>
            <WalletConnectionButton />
          </div>
        </div>
      </div>
      <div css={{ display: 'flex', gap: '2.4rem', flexWrap: 'wrap' }}>
        <HeaderWidgetPortalElement />
      </div>
    </div>
  )
}
