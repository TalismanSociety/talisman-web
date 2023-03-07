import { css } from '@emotion/react'
import * as Icon from '@talismn/icons'

import { ParsedTransaction, formatGenericAddress } from './lib'

// exported tx logo component

type Props = {
  className?: string
  parsed: ParsedTransaction | null | undefined
  addresses: string[]
}
export const TransactionLogo = ({ className, parsed, addresses }: Props) => {
  switch (parsed?.__typename) {
    case 'ParsedTransfer':
      const genericAddresses = addresses.map(formatGenericAddress)
      const from = formatGenericAddress(parsed.from)
      const to = formatGenericAddress(parsed.to)

      const type = (() => {
        if (genericAddresses.includes(from) && !genericAddresses.includes(to)) return 'Send'
        if (genericAddresses.includes(to) && !genericAddresses.includes(from)) return 'Receive'
        return 'Transfer'
      })()

      return <TransactionIconLogo className={className} logo={type} error={!parsed.success} />

    case 'ParsedCrowdloanContribute':
      return <TransactionIconLogo className={className} logo="Contribute" error={!parsed.success} />

    case 'ParsedStake':
    case 'ParsedPoolStake':
      return <TransactionIconLogo className={className} logo="Stake" error={!parsed.success} />

    case 'ParsedUnstake':
    case 'ParsedPoolUnstake':
      return <TransactionIconLogo className={className} logo="Unstake" error={!parsed.success} />

    case 'ParsedSwap':
      return <TransactionIconLogo className={className} logo="Swap" error={!parsed.success} />

    case 'ParsedSetIdentity':
      return <TransactionIconLogo className={className} logo="SetIdentity" error={!parsed.success} />

    case 'ParsedClearedIdentity':
      return <TransactionIconLogo className={className} logo="ClearIdentity" error={!parsed.success} />

    case 'ParsedPoolPaidOut':
      return <TransactionIconLogo className={className} logo="PoolPaidOut" error={!parsed.success} />

    case 'ParsedPoolWithdrawn':
      return <TransactionIconLogo className={className} logo="PoolWithdrawn" error={!parsed.success} />

    case 'ParsedPoolMemberRemoved':
      return <TransactionIconLogo className={className} logo="PoolMemberRemoved" error={!parsed.success} />

    case 'ParsedVote':
      return <TransactionIconLogo className={className} logo="VoteUp" error={!parsed.success} />

    case 'ParsedEthereumExec':
      return <TransactionIconLogo className={className} logo="EthereumExec" error={!parsed.success} />

    default:
      return <TransactionIconLogo className={className} logo="Unknown" />
  }
}

// transaction logos config

type IconKey = keyof typeof Icon
type TransactionLogoName =
  // generic
  | 'Generic'
  | 'Unknown'
  | 'Pending'
  | 'EthereumExec'

  // transfers
  | 'Send'
  | 'Receive'
  | 'Transfer'

  // crowdloans
  | 'Contribute'

  // staking
  | 'Stake'
  | 'StakeReward'
  | 'Unstake'
  | 'PoolWithdrawn'
  | 'PoolPaidOut'
  | 'PoolMemberRemoved'

  // proxies
  | 'Proxy'
  | 'SetIdentity'
  | 'ClearIdentity'
  | 'RemoveProxy'

  // governance
  | 'VoteUp'
  | 'VoteDown'

  // batch
  | 'Swap'
  | 'Batch'
const transactionLogos: Record<TransactionLogoName, { icon: IconKey; color: string }> = {
  // generic
  Generic: { icon: 'File', color: '#a5a5a5' },
  Unknown: { icon: 'Unknown', color: '#a5a5a5' },
  Pending: { icon: 'File', color: '#a5a5a5' },
  EthereumExec: { icon: 'Cpu', color: '#a5a5a5' },

  // transfers
  Send: { icon: 'ArrowUp', color: '#6a7aeb' },
  Receive: { icon: 'ArrowDown', color: '#38d448' },
  Transfer: { icon: 'Minimize2', color: '#ff9458' },

  // crowdloans
  Contribute: { icon: 'ArrowUp', color: '#53cbc8' },

  // staking
  Stake: { icon: 'Zap', color: '#ffbf12' },
  StakeReward: { icon: 'ArrowDown', color: '#ffbf12' },
  Unstake: { icon: 'Loader', color: '#ffbf12' },
  PoolPaidOut: { icon: 'Minimize2', color: '#ffbf12' },
  PoolWithdrawn: { icon: 'ArrowDown', color: '#ffbf12' },
  PoolMemberRemoved: { icon: 'UserMinus', color: '#ffbf12' },

  // proxies
  Proxy: { icon: 'Users', color: '#d5ff5c' },
  SetIdentity: { icon: 'UserPlus', color: '#d5ff5c' },
  ClearIdentity: { icon: 'UserMinus', color: '#d5ff5c' },
  RemoveProxy: { icon: 'UserMinus', color: '#d5ff5c' },

  // governance
  VoteUp: { icon: 'ThumbsUp', color: '#d5ff5c' },
  VoteDown: { icon: 'ThumbsDown', color: '#d5ff5c' },

  // batch
  Swap: { icon: 'Repeat', color: '#fd8fff' },
  Batch: { icon: 'Layers', color: '#fd8fff' },
}
const errorColor = '#d22424'

// tx icon logo component

type TransactionIconLogoProps = {
  className?: string
  logo: TransactionLogoName
  error?: boolean
}
const TransactionIconLogo = ({ className, logo, error }: TransactionIconLogoProps) => {
  const { icon, color: successColor } = transactionLogos[logo] ?? transactionLogos.Unknown
  const IconComponent = Icon[icon]

  const color = !error ? successColor : errorColor

  return (
    <div
      className={className}
      css={css`
        width: var(--font-size-xxlarge);
        height: var(--font-size-xxlarge);
        border-radius: 999999999999rem;
        color: ${color};
        background-color: ${color}40;

        display: flex;
        justify-content: center;
        align-items: center;

        svg {
          display: block;
          width: 50%;

          ${icon === 'Unknown' &&
          css`
            width: 35%;
          `}
        }
      `}
    >
      {/* @ts-expect-error */}
      <IconComponent />
    </div>
  )
}
