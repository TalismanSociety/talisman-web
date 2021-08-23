import { Panel, PanelSection } from '@components'

const Crowdloans = ({ id, className }) => (
  <section className={`wallet-assets ${className}`}>
    <Panel title="Crowdloans">
      <PanelSection comingSoon>🔑 This door will be unlocked soon</PanelSection>
    </Panel>
  </section>
)

export default Crowdloans
