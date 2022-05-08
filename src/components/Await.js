import { ReactComponent as Loader } from '@icons/loader.svg'
import styled from 'styled-components'

export const StyledLoader = styled(({ className }) => (
  <div className={`await ${className}`}>
    <Loader />
  </div>
))`
  display: block;
  padding: 2rem;
  width: 100%;
  text-align: center;
  font-size: inherit;
  > svg {
    font-size: inherit;
  }
`

const Await = ({ until = true, children }) => (until === true ? children : <StyledLoader />)

export default Await
