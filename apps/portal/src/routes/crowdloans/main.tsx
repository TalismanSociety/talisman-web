import styled from '@emotion/styled'

import { CrowdloanIndex as CrowdloanIndexx } from '@/components/legacy/widgets/CrowdloanIndex'

export const CrowdloanIndex = styled(({ className }: { className?: string }) => (
  <div className={className}>
    <CrowdloanIndexx withFilter />
  </div>
))`
  margin: 0 auto;
`
