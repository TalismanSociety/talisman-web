import { Parachain } from '@archetypes'
import { Info, Panel } from '@components'
import { useParachainById } from '@libs/talisman'
import styled from 'styled-components'

const AssetItem = styled(({ id, className }) => {
  const { name, longName } = useParachainById(id)

  return (
    <div className={className}>
      <span className="left">
        <Info title="Karura" subtitle="karura" graphic={<Parachain.Asset id={id} type="logo" size={4} />} />
      </span>
      <span className="right">
        <Info title="36 KAR" subtitle="-" />
      </span>
    </div>
  )
})`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > span {
    display: flex;
    align-items: center;

    &.right {
      text-align: right;
    }
  }
`

const Assets = ({ id, className }) => (
  <section className={`wallet-assets ${className}`}>
    <Panel title="Staking">
      <Panel.Section comingSoon>🔑 This door will be unlocked soon</Panel.Section>
    </Panel>
  </section>
)

export default Assets
