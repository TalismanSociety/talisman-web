import { Info, TokenLogo } from '@components'
import Identicon from '@components/atoms/Identicon'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ReactComponent as _ArrowRight } from '@icons/arrow-right.svg'
import { Account } from '@libs/talisman/extension'
import { encodeAnyAddress, formatDecimals } from '@talismn/util'
import { truncateAddress } from '@util/helpers'
import startCase from 'lodash/startCase'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
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
          graphic={<Identicon value={parsed.from} size="3.2rem" />}
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
          graphic={<Identicon value={parsed.to} size="3.2rem" />}
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
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
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
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
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
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
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
          {stakeInfo}

          <ArrowRight />

          {tokenInfo}
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
            // TODO: Add fiat prices
            // title={`${formatDecimals(from.liquidityChange)} ${from.symbol}`}
            // subtitle="$xx.xx"
            title={startCase(parsed.chainId)}
            subtitle={`${formatDecimals(from!.liquidityChange)} ${from!.symbol}`}
            graphic={<TokenLogo token={{ symbol: from!.symbol, logo: from!.logo }} />}
            invert
          />

          <ArrowRight />

          <Info
            // TODO: Add fiat prices
            // title={`${formatDecimals(to.liquidityChange)} ${to.symbol}`}
            // subtitle="$xx.xx"
            title={startCase(parsed.chainId)}
            subtitle={`${formatDecimals(to!.liquidityChange)} ${to!.symbol}`}
            graphic={<TokenLogo token={{ symbol: to!.symbol, logo: to!.logo }} />}
            invert
          />
        </div>
      )
    }

    case 'ParsedSetIdentity': {
      return <div className="details" />
    }

    case 'ParsedClearedIdentity': {
      return <div className="details" />
    }

    case 'ParsedPoolStake': {
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.bonded)} ${parsed.tokenSymbol}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const poolInfo = (
        <Info
          title={t('Nomination Pool')}
          subtitle={parsed.poolId}
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

          {poolInfo}
        </div>
      )
    }

    case 'ParsedPoolUnstake':
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          // TODO: Determine what to show when parsed.balance !== parsed.points (a slash has occurred)
          subtitle={`${formatDecimals(parsed.points)} ${parsed.tokenSymbol}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const poolInfo = (
        <Info
          title={t('Nomination Pool')}
          subtitle={parsed.poolId}
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
          {poolInfo}

          <ArrowRight />

          {tokenInfo}
        </div>
      )

    case 'ParsedPoolPaidOut': {
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.payout)} ${parsed.tokenSymbol}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const poolInfo = (
        <Info
          title={t('Nomination Pool')}
          subtitle={parsed.poolId}
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
          {poolInfo}

          <ArrowRight />

          {tokenInfo}
        </div>
      )
    }

    case 'ParsedPoolWithdrawn': {
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          // TODO: Determine what to show when parsed.balance !== parsed.points (a slash has occurred)
          subtitle={`${formatDecimals(parsed.points)} ${parsed.tokenSymbol}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const poolInfo = (
        <Info
          title={t('Nomination Pool')}
          subtitle={parsed.poolId}
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
          {poolInfo}

          <ArrowRight />

          {tokenInfo}
        </div>
      )
    }

    case 'ParsedPoolMemberRemoved': {
      const member = encodeAnyAddress(parsed.member)
      const memberName = addressBook[member]

      const memberInfo = (
        <Info
          title={'Member removed'}
          subtitle={
            <ClickToCopy copy={parsed.member} message="Address copied to the clipboard">
              {memberName ?? truncateAddress(parsed.member, 4)}
            </ClickToCopy>
          }
          graphic={<Identicon value={parsed.member} size="3.2rem" />}
          invert
        />
      )
      const poolInfo = (
        <Info
          title={t('Nomination Pool')}
          subtitle={parsed.poolId}
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
          {poolInfo}

          <ArrowRight />

          {memberInfo}
        </div>
      )
    }

    case 'ParsedVote': {
      const tokenInfo = (
        <Info
          // TODO: Add fiat prices
          // title={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          // subtitle="$xx.xx"
          title={startCase(parsed.chainId)}
          subtitle={`${formatDecimals(parsed.amount)} ${parsed.tokenSymbol}`}
          graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
          invert
        />
      )
      const { referendumUrl } = parsed
      const MaybeAnchor =
        typeof referendumUrl === 'string'
          ? ({ className, children }: { className?: string; children: ReactNode }) => (
              <a className={className} href={referendumUrl} target="_blank" rel="noreferrer">
                {children}
              </a>
            )
          : ({ className, children }: { className?: string; children: ReactNode }) => (
              <span className={className}>{children}</span>
            )
      const voteInfo = (
        <MaybeAnchor>
          <Info
            title={t('Vote {{voteNumber}}', { voteNumber: parsed.voteNumber })}
            subtitle={t('Referendum {{referendumId}}', { referendumId: parsed.referendumIndex })}
            graphic={<TokenLogo token={{ symbol: parsed.tokenSymbol, logo: parsed.tokenLogo }} />}
            invert
          />
        </MaybeAnchor>
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

          {voteInfo}
        </div>
      )
    }

    default:
      const exhaustiveCheck: never = parsed.__typename
      console.error(`Unhandled transaction type ${exhaustiveCheck}`)
      return <div className="details" />
  }
}

const ArrowRight = styled(_ArrowRight)`
  display: block;
  height: 2rem;
`
