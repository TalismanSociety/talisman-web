import styled from '@emotion/styled'

import { CrowdloanRootNav } from '@/components/legacy/widgets/CrowdloanRootNav'
import { WalletCrowdloans as ParticipatedCrowdloans } from '@/components/legacy/widgets/WalletCrowdloans'

export const CrowdloanParticipated = styled(({ className }: { className?: string }) => (
  <div className={className} css={{ padding: '2.4rem' }}>
    <CrowdloanRootNav />
    <ParticipatedCrowdloans />
  </div>
))`
  margin: 0 auto;
`
