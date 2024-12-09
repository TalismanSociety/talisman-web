import { useTranslation } from 'react-i18next'

import { Panel, PanelSection } from '@/components/legacy/Panel'

export const WalletStaking = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <section className={`wallet-assets ${className ?? ''}`}>
      <Panel title={t('NFTs')}>
        <PanelSection comingSoon>🔑 {t('This door will be unlocked soon')}</PanelSection>
      </Panel>
    </section>
  )
}
