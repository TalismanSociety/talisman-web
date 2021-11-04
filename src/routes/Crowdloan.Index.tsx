import { CrowdloanV2 as Crowdloan } from '@archetypes'
import styled from 'styled-components'

const CrowdloanIndex = styled(({ className }) => (
  <div className={className}>
    <Crowdloan.Index withFilter />
  </div>
))`
  max-width: 1280px;
  margin: 0 auto;
`

export default CrowdloanIndex
