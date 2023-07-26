import { Crowdloan } from '@archetypes'
import styled from '@emotion/styled'

const CrowdloanIndex = styled(({ className }: { className?: string }) => (
  <div className={className}>
    <Crowdloan.Index withFilter />
  </div>
))`
  margin: 0 auto;
`

export default CrowdloanIndex
