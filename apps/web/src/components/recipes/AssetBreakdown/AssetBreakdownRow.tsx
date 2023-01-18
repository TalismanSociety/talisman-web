import Identicon from '@components/atoms/Identicon'
import Text from '@components/atoms/Text'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Account } from '@libs/talisman/extension'
import { Balances } from '@talismn/balances'
import { BalanceFormatter } from '@talismn/balances'
import { formatDecimals } from '@talismn/util'
import { startCase } from 'lodash'

import { AssetBalance } from '../Asset'

const slideDown = keyframes`
    from {
        opacity: 0;
        transform: translateY(-10%);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`

export const AssetBreakdownRowHeader = ({ token, isOrml }: { token: any; isOrml?: boolean }) => {
  return (
    <AssetRow>
      <div
        css={{
          padding: '1.6rem',
        }}
      >
        <td
          css={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1.6rem',
          }}
        >
          <img
            src={token?.tokenDetails?.logo}
            alt={token?.name}
            css={{
              width: '2em',
              height: '2em',
              borderRadius: '50%',
            }}
          />
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              justifyContent: 'center',
            }}
          >
            <Text.Body
              css={{
                fontSize: '1.6rem',
                color: 'var(--color-text)',
                fontWeight: 'bold',
              }}
            >
              {token?.tokenDetails?.type === 'evm-erc20'
                ? token?.tokenDetails?.symbol
                : startCase(token?.tokenDetails?.chain?.id)}
            </Text.Body>
            {/* <Text.Body css={{
                                fontSize: '1.6rem',
                                color: 'var(--color-dim)',
                                fontWeight: 'bold',
                            }}>
                                ({token?.tokenDetails?.symbol})
                            </Text.Body> */}
          </div>
        </td>
        <td align="right">
          {token?.locked && (
            <AssetBalance
              fiat={!isOrml ? token?.overallLockedFiatAmount : token?.lockedFiatAmount}
              planck={!isOrml ? token?.overallLockedAmount : token?.lockedAmount}
              locked={token?.locked}
              symbol={token?.tokenDetails?.symbol}
            />
          )}
        </td>
        <td align="right">
          <AssetBalance
            fiat={!isOrml ? token?.overallFiatAmount : token?.fiatAmount}
            planck={!isOrml ? token?.overallTokenAmount : token?.amount}
            symbol={token?.tokenDetails?.symbol}
          />
        </td>
      </div>
    </AssetRow>
  )
}

type AssetBreakdownProps = {
  tokenBalance?: Balances
  account: Account
  decimals: number
  symbol: string
}

export const AssetBreakdownRowAvailable = ({ tokenBalance, decimals, symbol, account }: AssetBreakdownProps) => {
  if (tokenBalance === undefined) return <></>

  const isLocked = tokenBalance?.sum?.fiat('usd')?.locked > 0
  const fiatLockedAmount = tokenBalance?.sum?.fiat('usd')?.locked
  const fiatAmount = tokenBalance?.sum?.fiat('usd')?.transferable
  const planckLockedAmount = formatDecimals(
    new BalanceFormatter(
      tokenBalance.sorted.reduce((sum, balance) => sum + balance.locked.planck, BigInt('0')),
      decimals
    ).tokens
  )
  const planckAmount = formatDecimals(
    new BalanceFormatter(
      tokenBalance.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0')),
      decimals
    ).tokens
  )

  if (fiatAmount === 0 || planckAmount === '0') return <></>

  return (
    <AssetRow>
      <div
        css={{
          padding: '1.6rem',
        }}
      >
        <td
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Text.Body
            css={{
              fontSize: '1.6rem',
              color: 'var(--color-text)',
              fontWeight: 'bold',
            }}
          >
            Available
          </Text.Body>
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Identicon value={account?.address} css={{ width: '2rem', height: '2rem' }} />
            <Text.Body>{account?.name}</Text.Body>
          </div>
        </td>
        <td align="right">
          {isLocked && (
            <AssetBalance fiat={fiatLockedAmount} planck={planckLockedAmount} locked={true} symbol={symbol} />
          )}
        </td>
        <td align="right">
          <AssetBalance fiat={fiatAmount} planck={planckAmount} locked={false} symbol={symbol} />
        </td>
      </div>
    </AssetRow>
  )
}

const AssetRow = styled.tr`
  & > div {
    background-color: #1b1b1b;
    animation: ${slideDown} 0.3s ease-in-out;

    display: grid;
    grid-template-columns: 6fr 2fr;

    & > td {
      width: 100% !important;
    }

    @media (min-width: 768px) {
      grid-template-columns: 6fr 2fr 2fr;
    }
  }
`
