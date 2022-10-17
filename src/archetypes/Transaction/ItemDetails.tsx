import { Info } from '@components'
import styled from '@emotion/styled'
import { ReactComponent as _ArrowRight } from '@icons/arrow-right.svg'
import { Account } from '@libs/talisman'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import startCase from 'lodash/startCase'
import { useTranslation } from 'react-i18next'

import { Avatar } from './Avatar'
import { ParsedTransaction } from './lib'

type Props = {
  parsed: ParsedTransaction | null | undefined
  addresses: string[]
  accounts: Account[]
}
export const ItemDetails = ({ parsed, addresses, accounts }: Props) => {
  const { t } = useTranslation()
  if (!parsed || parsed.__typename === undefined) return <div />

  const addressBook = accounts.reduce((addressBook, account) => {
    if (account.name) addressBook[encodeAnyAddress(account.address)] = account.name
    return addressBook
  }, {} as Record<string, string>)

  switch (parsed.__typename) {
    case 'ParsedTransfer': {
      const genericAddresses = addresses.map(a => encodeAnyAddress(a))
      const from = encodeAnyAddress(parsed.from)
      const to = encodeAnyAddress(parsed.to)
      const isReceiver = genericAddresses.includes(to) && !genericAddresses.includes(from)

      const fromName = addressBook[from]
      const toName = addressBook[to]

      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<TokenLogo className="token-logo" src={parsed.tokenLogo} alt={`${parsed.tokenSymbol} token logo`} />}
        />
      )
      const senderInfo = (
        <Info
          title={fromName || 'From'}
          subtitle={truncateAddress(parsed.from, 4)}
          graphic={<Avatar value={parsed.from} />}
        />
      )
      const receiverInfo = (
        <Info title={toName || 'To'} subtitle={truncateAddress(parsed.to, 4)} graphic={<Avatar value={parsed.to} />} />
      )

      return (
        <div className="details">
          {isReceiver ? senderInfo : tokenInfo}

          <ArrowRight />

          {isReceiver ? tokenInfo : receiverInfo}
        </div>
      )
    }

    case 'ParsedCrowdloanContribute': {
      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<TokenLogo className="token-logo" src={parsed.tokenLogo} alt={`${parsed.tokenSymbol} token logo`} />}
        />
      )
      const fundInfo = (
        <Info
          title={t('To')}
          subtitle={`${t('Crowdloan')} ${parsed.fund}`}
          graphic={<TokenLogo className="token-logo" src={parsed.tokenLogo} alt={`${parsed.tokenSymbol} token logo`} />}
        />
      )

      return (
        <div className="details">
          {tokenInfo}

          <ArrowRight />

          {fundInfo}
        </div>
      )
    }

    case 'ParsedStake': {
      const tokenInfo = (
        <Info
          title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          subtitle="$xx.xx"
          graphic={<TokenLogo className="token-logo" src={parsed.tokenLogo} alt={`${parsed.tokenSymbol} token logo`} />}
        />
      )
      const stakeInfo = (
        <Info
          title={startCase(parsed.chainId)}
          subtitle={t('Staking balance')}
          graphic={<TokenLogo className="token-logo" src={parsed.tokenLogo} alt={`${parsed.tokenSymbol} token logo`} />}
        />
      )

      return (
        <div className="details">
          {tokenInfo}

          <ArrowRight />

          {stakeInfo}
        </div>
      )
    }

    case 'ParsedUnstake': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    case 'ParsedAddLiquidity': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }
    case 'ParsedRemoveLiquidity': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    case 'ParsedAddProvision': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }
    case 'ParsedRefundProvision': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    case 'ParsedSwap': {
      return (
        <div className="details">
          {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(parsed, null, 2)}</pre>}
        </div>
      )
    }

    default:
      const exhaustiveCheck: never = parsed.__typename
      throw new Error(`Unhandled transaction type ${exhaustiveCheck}`)
  }
}

const TokenLogo = styled.img`
  display: block;
  width: 1em;
  height: 1em;
  border-radius: 999999999999rem;
`

const ArrowRight = styled(_ArrowRight)`
  display: block;
  height: 2rem;
`
