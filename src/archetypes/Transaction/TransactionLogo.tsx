import * as Icon from '@components/atoms/Icon'
import { css } from '@emotion/react'
import { encodeAnyAddress } from '@talismn/util'

import { ParsedTransaction } from './lib'

// exported tx logo component

type Props = {
  className?: string
  parsed: ParsedTransaction | null | undefined
  addresses: string[]
}
export const TransactionLogo = ({ className, parsed, addresses }: Props) => {
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

      return <TransactionIconLogo className={className} logo={type} error={!parsed.success} />

    case 'ParsedCrowdloanContribute':
      return <TransactionIconLogo className={className} logo="Contribute" error={!parsed.success} />

    case 'ParsedStake':
      return <TransactionIconLogo className={className} logo="Stake" error={!parsed.success} />

    case 'ParsedUnstake':
      return <TransactionIconLogo className={className} logo="Unstake" error={!parsed.success} />

    case 'ParsedSwap':
      return <TransactionIconLogo className={className} logo="Swap" error={!parsed.success} />

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

  // proxies
  | 'Proxy'
  | 'SetIdentity'
  | 'RemoveProxy'

  // batch
  | 'Swap'
  | 'Batch'
const transactionLogos: Record<TransactionLogoName, { icon: IconKey; color: string }> = {
  // generic
  Generic: { icon: 'File', color: '#a5a5a5' },
  Unknown: { icon: 'Unknown', color: '#a5a5a5' },
  Pending: { icon: 'File', color: '#a5a5a5' },

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

  // proxies
  Proxy: { icon: 'Users', color: '#d5ff5c' },
  SetIdentity: { icon: 'UserPlus', color: '#d5ff5c' },
  RemoveProxy: { icon: 'UserMinus', color: '#d5ff5c' },

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
      <IconComponent />
    </div>
  )
}
