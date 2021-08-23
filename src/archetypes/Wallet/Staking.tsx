import { Panel, PanelSection } from '@components'

const Staking = ({ id, className }) => (
  <section className={`wallet-assets ${className}`}>
    <Panel title="Staking">
      <PanelSection comingSoon>🔑 This door will be unlocked soon</PanelSection>
    </Panel>
  </section>
)

export default Staking
