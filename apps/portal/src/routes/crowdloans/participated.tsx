import { RootNav } from '@archetypes/Crowdloan/RootNav'
import ParticipatedCrowdloans from '@archetypes/Wallet/Crowdloans'
import styled from '@emotion/styled'
import { TitlePortal } from '@routes/layout'

export const CrowdloanParticipated = styled(({ className }: { className?: string }) => (
  <div className={className} css={{ padding: '2.4rem' }}>
    <TitlePortal>Crowdloans</TitlePortal>
    <RootNav />
    <ParticipatedCrowdloans />
  </div>
))`
  margin: 0 auto;
`
