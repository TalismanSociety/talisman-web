import { Crowdloan } from '@archetypes'
import styled from '@emotion/styled'

const CrowdloanIndex = styled(({ className }) => (
  <div className={className}>
    <Crowdloan.Index withFilter />
  </div>
))`
  max-width: 1280px;
  margin: 0 auto;
`

export default CrowdloanIndex
