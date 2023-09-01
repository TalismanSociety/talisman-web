import { Panel, PanelSection } from '@components'
import { useTranslation } from 'react-i18next'

const Staking = ({ className }: { className?: string }) => {
  const { t } = useTranslation()
  return (
    <section className={`wallet-assets ${className ?? ''}`}>
      <Panel title={t('NFTs')}>
        <PanelSection comingSoon>🔑 {t('This door will be unlocked soon')}</PanelSection>
      </Panel>
    </section>
  )
}

export default Staking
