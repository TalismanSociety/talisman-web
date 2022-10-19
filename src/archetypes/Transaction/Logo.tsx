import styled from '@emotion/styled'
// import { ReactComponent as AddProxyFailed } from '@icons/transaction-icons/add-proxy-failed.svg'
// import { ReactComponent as AddProxy } from '@icons/transaction-icons/add-proxy.svg'
// import { ReactComponent as BatchFailed } from '@icons/transaction-icons/batch-failed.svg'
// import { ReactComponent as Batch } from '@icons/transaction-icons/batch.svg'
import { ReactComponent as CrowdloanContributeFailed } from '@icons/transaction-icons/crowdloan-contribute-failed.svg'
import { ReactComponent as CrowdloanContribute } from '@icons/transaction-icons/crowdloan-contribute.svg'
// import { ReactComponent as Generic } from '@icons/transaction-icons/generic.svg'
// import { ReactComponent as Pending } from '@icons/transaction-icons/pending.svg'
import { ReactComponent as ReceiveFailed } from '@icons/transaction-icons/receive-failed.svg'
import { ReactComponent as Receive } from '@icons/transaction-icons/receive.svg'
// import { ReactComponent as RemoveProxyFailed } from '@icons/transaction-icons/remove-proxy-failed.svg'
// import { ReactComponent as RemoveProxy } from '@icons/transaction-icons/remove-proxy.svg'
import { ReactComponent as SendFailed } from '@icons/transaction-icons/send-failed.svg'
import { ReactComponent as Send } from '@icons/transaction-icons/send.svg'
// import { ReactComponent as SetIdentityFailed } from '@icons/transaction-icons/set-identity-failed.svg'
// import { ReactComponent as SetIdentity } from '@icons/transaction-icons/set-identity.svg'
import { ReactComponent as StakeFailed } from '@icons/transaction-icons/stake-failed.svg'
import { ReactComponent as Stake } from '@icons/transaction-icons/stake.svg'
import { ReactComponent as SwapFailed } from '@icons/transaction-icons/swap-failed.svg'
import { ReactComponent as Swap } from '@icons/transaction-icons/swap.svg'
import { ReactComponent as TransferFailed } from '@icons/transaction-icons/transfer-failed.svg'
import { ReactComponent as Transfer } from '@icons/transaction-icons/transfer.svg'
import { ReactComponent as Unknown } from '@icons/transaction-icons/unknown.svg'
import { ReactComponent as UnstakeFailed } from '@icons/transaction-icons/unstake-failed.svg'
import { ReactComponent as Unstake } from '@icons/transaction-icons/unstake.svg'
// import { ReactComponent as WithdrawStakeFailed } from '@icons/transaction-icons/withdraw-stake-failed.svg'
// import { ReactComponent as WithdrawStake } from '@icons/transaction-icons/withdraw-stake.svg'
import { encodeAnyAddress } from '@talismn/util'

import { ParsedTransaction } from './lib'

type Props = { className?: string; parsed: ParsedTransaction | null | undefined; addresses: string[] }
export const Logo = styled(({ className, parsed, addresses }: Props) => {
  switch (parsed?.__typename) {
    case 'ParsedTransfer':
      const genericAddresses = addresses.map(a => encodeAnyAddress(a))
      const from = encodeAnyAddress(parsed.from)
      const to = encodeAnyAddress(parsed.to)

      const type = (() => {
        if (genericAddresses.includes(from) && !genericAddresses.includes(to)) return 'Send'
        if (genericAddresses.includes(to) && !genericAddresses.includes(from)) return 'Receive'
        return 'Transfer'
      })()

      if (type === 'Send') {
        if (parsed.success) return <Send className={className} />
        return <SendFailed className={className} />
      }
      if (type === 'Receive') {
        if (parsed.success) return <Receive className={className} />
        return <ReceiveFailed className={className} />
      }
      if (parsed.success) return <Transfer className={className} />
      return <TransferFailed className={className} />

    case 'ParsedCrowdloanContribute':
      if (parsed.success) return <CrowdloanContribute className={className} />
      return <CrowdloanContributeFailed className={className} />

    case 'ParsedStake':
      if (parsed.success) return <Stake className={className} />
      return <StakeFailed className={className} />

    case 'ParsedUnstake':
      if (parsed.success) return <Unstake className={className} />
      return <UnstakeFailed className={className} />

    case 'ParsedSwap':
      if (parsed.success) return <Swap className={className} />
      return <SwapFailed className={className} />

    default:
      return <Unknown className={className} />
  }
})`
  width: var(--font-size-xxlarge);
  height: var(--font-size-xxlarge);
`
