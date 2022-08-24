import { ReactComponent as Unknown } from '@icons/transaction-icons/generic-icon-unknown.svg'
import { ReactComponent as Recieve } from '@icons/transaction-icons/receive-icon.svg'
import { ReactComponent as Send } from '@icons/transaction-icons/send-icon.svg'
import styled from 'styled-components'

const Logo = ({ type, className }: any) => {
  switch (type) {
    case 'INBOUND':
      return <Recieve className={className} />
    case 'OUTBOUND':
      return <Send className={className} />
    default:
      return <Unknown className={className} />
  }
}

const StyledLogo = styled(Logo)`
  width: var(--font-size-xxlarge);
  height: var(--font-size-xxlarge);
`

export default StyledLogo
