import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useNetwork } from '@talismn/balances-react'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { startCase } from 'lodash'

import type { PortfolioToken } from '@/components/legacy/widgets/useAssets'
import { AccountIcon } from '@/components/molecules/AccountIcon'
import { AssetBalance } from '@/components/recipes/Asset'
import { type Account } from '@/domains/accounts/recoils'
import { useNetworkType } from '@/hooks/useNetworkType'
import { UNKNOWN_NETWORK_URL } from '@/util/unknownLogoUrls'

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

export const AssetBreakdownRowHeader = ({ token }: { token: PortfolioToken }) => {
  const network = useNetwork(token.tokenDetails.networkId)
  const networkInfo = useNetworkType(network)

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
          <Tooltip content={token.tokenDetails.network?.name}>
            <img
              src={token.tokenDetails.network?.logo ?? UNKNOWN_NETWORK_URL}
              alt={token.tokenDetails.network?.name ?? undefined}
              css={{
                width: '2em',
                height: '2em',
                borderRadius: '50%',
              }}
            />
          </Tooltip>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-white">{network?.name ?? 'Unknown Network'}</div>
            <div className="text-xl text-white/60">{networkInfo}</div>
          </div>
        </td>
        <td align="right">
          {token?.locked && (
            <AssetBalance
              fiat={token?.lockedFiatAmount}
              planck={token?.lockedAmountFormatted}
              symbol={token?.tokenDetails?.symbol}
              locked={token?.locked}
              stale={token.stale}
            />
          )}
        </td>
        <td align="right">
          <AssetBalance
            fiat={token?.transferableFiatAmount}
            planck={token?.transferableAmountFormatted}
            symbol={token?.tokenDetails?.symbol}
            stale={token.stale}
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
    stale?: boolean
  }
}

export const AssetBreakdownRow = ({ assetSummary }: AssetBreakdownProps) => {
  const { planckAmount, fiatAmount, account, symbol, variant, stale } = assetSummary

  return (
    <AssetRow
      css={{
        '& > div': {
          gridTemplateColumns: '8fr 2fr !important',

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
          <AssetBalance fiat={fiatAmount} planck={planckAmount} symbol={symbol} locked={false} stale={stale} />
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
