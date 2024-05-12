import { RootNav } from '../../components/legacy/archetypes/Crowdloan/RootNav'
import ParticipatedCrowdloans from '../../components/legacy/archetypes/Wallet/Crowdloans'
import { TitlePortal } from '../layout'
import styled from '@emotion/styled'

export const CrowdloanParticipated = styled(({ className }: { className?: string }) => (
  <div className={className} css={{ padding: '2.4rem' }}>
    <TitlePortal>Crowdloans</TitlePortal>
    <RootNav />
    <ParticipatedCrowdloans />
  </div>
))`
  margin: 0 auto;
`
