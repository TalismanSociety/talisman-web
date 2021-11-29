import { ConnectWalletSelection } from '@archetypes/ConnectWalletSelection/ConnectWalletSelection'
import styled from 'styled-components'

const Connect = styled(({ className }) => {
  return (
    <div className={className}>
      <ConnectWalletSelection />
    </div>
  )
})`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default Connect
