import { ReactComponent as CrowdloanContributeFailed } from '@icons/transaction-icons/crowdloan-contribute-failed.svg'
import { ReactComponent as CrowdloanContribute } from '@icons/transaction-icons/crowdloan-contribute.svg'
import { ReactComponent as ReceiveFailed } from '@icons/transaction-icons/receive-failed.svg'
import { ReactComponent as Receive } from '@icons/transaction-icons/receive.svg'
import { ReactComponent as SendFailed } from '@icons/transaction-icons/send-failed.svg'
import { ReactComponent as Send } from '@icons/transaction-icons/send.svg'
import { ReactComponent as StakeFailed } from '@icons/transaction-icons/stake-failed.svg'
import { ReactComponent as Stake } from '@icons/transaction-icons/stake.svg'
import { ReactComponent as SwapFailed } from '@icons/transaction-icons/swap-failed.svg'
import { ReactComponent as Swap } from '@icons/transaction-icons/swap.svg'
import { ReactComponent as Unknown } from '@icons/transaction-icons/unknown.svg'
import { ReactComponent as UnstakeFailed } from '@icons/transaction-icons/unstake-failed.svg'
import { ReactComponent as Unstake } from '@icons/transaction-icons/unstake.svg'
import { encodeAnyAddress } from '@talismn/util'
import styled from 'styled-components'

import { ParsedTransaction } from './types'

type Props = { className?: string; parsed: ParsedTransaction | null | undefined; addresses: string[] }
const Logo = ({ className, parsed, addresses }: Props) => {
  switch (parsed?.type) {
    case 'transfer':
      const isReceiver = addresses.map(a => encodeAnyAddress(a)).includes(encodeAnyAddress(parsed.to))
      if (isReceiver) {
        if (parsed.success) return <Receive className={className} />
        return <ReceiveFailed className={className} />
      }
      if (parsed.success) return <Send className={className} />
      return <SendFailed className={className} />

    case 'crowdloan contribution':
      if (parsed.success) return <CrowdloanContribute className={className} />
      return <CrowdloanContributeFailed className={className} />

    case 'stake':
      if (parsed.success) return <Stake className={className} />
      return <StakeFailed className={className} />

    case 'unstake':
      if (parsed.success) return <Unstake className={className} />
      return <UnstakeFailed className={className} />

    case 'swap':
      if (parsed.success) return <Swap className={className} />
      return <SwapFailed className={className} />

    default:
      return <Unknown className={className} />
  }
}

const StyledLogo = styled(Logo)`
  width: var(--font-size-xxlarge);
  height: var(--font-size-xxlarge);
`

export default StyledLogo
