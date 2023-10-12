import { RootNav } from '@archetypes/Crowdloan/RootNav'
import ParticipatedCrowdloans from '@archetypes/Wallet/Crowdloans'
import styled from '@emotion/styled'

export const CrowdloanParticipated = styled(({ className }: { className?: string }) => (
  <div className={className} css={{ padding: '2.4rem' }}>
    <RootNav />
    <ParticipatedCrowdloans />
  </div>
))`
  margin: 0 auto;
`
