import { type Account } from '@domains/accounts/recoils'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Text, Tooltip } from '@talismn/ui'
import { startCase } from 'lodash'

import AccountIcon from '@components/molecules/AccountIcon/AccountIcon'
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
          <Tooltip content={startCase(token?.tokenDetails?.chain?.id ?? token?.tokenDetails?.coingeckoId)}>
            <img
              src={
                token?.tokenDetails?.evmNetwork
                  ? token?.tokenDetails?.logo
                  : `https://raw.githubusercontent.com/TalismanSociety/chaindata/v3/assets/chains/${
                      token?.tokenDetails?.chain?.id as string
                    }.svg`
              }
              alt={token?.name}
              css={{
                width: '2em',
                height: '2em',
                borderRadius: '50%',
              }}
            />
          </Tooltip>
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
              {token?.tokenDetails?.tokenDisplayName}
            </Text.Body>
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
  assetSummary: {
    planckAmount: string
    fiatAmount: number
    account: Account
    symbol: string
    variant: string
  }
}

export const AssetBreakdownRow = ({ assetSummary }: AssetBreakdownProps) => {
  const { planckAmount, fiatAmount, account, symbol, variant } = assetSummary

  return (
    <AssetRow
      css={{
        '& > div': {
          'gridTemplateColumns': '8fr 2fr !important',

          '> td': {
            display: 'table-cell !important',
          },
        },
      }}
    >
      <div
        css={{
          padding: '1.6rem',
        }}
      >
        <td valign="middle">
          <div
            css={{
              display: 'flex',
              flexDirection: 'column',
              // alignItems: 'center',
              gap: '0.3em',
            }}
          >
            <Text.Body
              css={{
                fontSize: '1.6rem',
                color: 'var(--color-text)',
                fontWeight: 'bold',
              }}
            >
              {startCase(variant)}
            </Text.Body>
            <div
              css={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AccountIcon account={account} css={{ width: '2rem', height: '2rem' }} />
              <Text.Body>{account?.name}</Text.Body>
            </div>
          </div>
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
