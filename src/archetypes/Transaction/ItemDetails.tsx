import { Info, TokenLogo } from '@components'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactComponent as _ArrowRight } from '@icons/arrow-right.svg'
import { Account } from '@libs/talisman'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import startCase from 'lodash/startCase'
import { useTranslation } from 'react-i18next'

import { Avatar } from './Avatar'
import { ClickToCopy } from './ClickToCopy'
import { ItemNoDetails } from './ItemNoDetails'
import { ParsedTransaction } from './lib'

type Props = {
  parsed: ParsedTransaction | null | undefined
  addresses: string[]
  accounts: Account[]
}
export const ItemDetails = ({ parsed, addresses, accounts }: Props) => {
  const { t } = useTranslation()

  if (typeof parsed?.__typename !== 'string') return <ItemNoDetails />

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
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const senderInfo = (
        <Info
          title={'From'}
          subtitle={
            <ClickToCopy copy={parsed.from} message="Address copied to the clipboard">
              {fromName ?? truncateAddress(parsed.from, 4)}
            </ClickToCopy>
          }
          graphic={<Avatar value={parsed.from} />}
          invert
        />
      )
      const receiverInfo = (
        <Info
          title={'To'}
          subtitle={
            <ClickToCopy copy={parsed.to} message="Address copied to the clipboard">
              {toName ?? truncateAddress(parsed.to, 4)}
            </ClickToCopy>
          }
          graphic={<Avatar value={parsed.to} />}
          invert
        />
      )

      return (
        <div
          className="details"
          css={css`
            > *:last-child {
              padding-left: 2rem;
            }
          `}
        >
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
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const fundInfo = (
        <Info
          title={t('To')}
          subtitle={`${t('Crowdloan')} ${parsed.fund}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )

      return (
        <div
          className="details"
          css={css`
            > *:last-child {
              padding-left: 2rem;
            }
          `}
        >
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
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const stakeInfo = (
        <Info
          title={startCase(parsed.chainId)}
          subtitle={t('Staking balance')}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )

      return (
        <div
          className="details"
          css={css`
            > *:last-child {
              padding-left: 2rem;
            }
          `}
        >
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
      const from = parsed.tokens[0]
      const to = parsed.tokens.slice(-1)[0]

      return (
        <div
          className="details"
          css={css`
            > *:last-child {
              padding-left: 2rem;
            }
          `}
        >
          <Info
            title={`${formatDecimals(from.liquidityChange)} ${from.symbol}`}
            subtitle="$xx.xx"
            graphic={<TokenLogo token={{ symbol: from.symbol, logo: from.logo }} />}
            invert
          />

          <ArrowRight />

          <Info
            title={`${formatDecimals(to.liquidityChange)} ${to.symbol}`}
            subtitle="$xx.xx"
            graphic={<TokenLogo token={{ symbol: to.symbol, logo: to.logo }} />}
            invert
          />
        </div>
      )
    }

    default:
      const exhaustiveCheck: never = parsed.__typename
      throw new Error(`Unhandled transaction type ${exhaustiveCheck}`)
  }
}

const ArrowRight = styled(_ArrowRight)`
  display: block;
  height: 2rem;
`
