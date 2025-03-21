import type { ReactElement, ReactNode } from 'react'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { type Balances } from '@talismn/balances'
import { githubUnknownTokenLogoUrl } from '@talismn/chaindata-provider'
import { useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { Tooltip } from '@talismn/ui/atoms/Tooltip'
import { HiddenDetails } from '@talismn/ui/molecules/HiddenDetails'
import { AlertTriangle, Lock } from '@talismn/web-icons'
import { isEmpty } from 'lodash'
import { Children } from 'react'
import { useNavigate } from 'react-router-dom'

import type { PortfolioToken } from '@/components/legacy/widgets/useAssets'
import { AssetLogoWithChain } from '@/components/recipes/AssetLogoWithChain'
import { AssetNetworksLogoStack } from '@/components/recipes/AssetNetworksLogoStack'
import { AnimatedFiatNumber } from '@/components/widgets/AnimatedFiatNumber'
import { RedactableBalance } from '@/components/widgets/RedactableBalance'

export type AssetProps = {
  className?: string
  token: PortfolioToken
  balances: Balances | undefined
  lockedAsset?: boolean
}

export const Asset = ({ token, lockedAsset }: AssetProps) => {
  const navigate = useNavigate()

  return (
    <tr
      className="asset"
      css={{
        // slide down on load
        animation: `${slideDown} 0.3s ease-in-out`,
      }}
      onClick={() => {
        navigate('/portfolio/assets/' + (token.tokenDetails.symbol ?? ''))
      }}
    >
      <td valign="top">
        {/* First Column */}
        <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <AssetLogoWithChain
            className="m-[8px] text-[32px] sm:text-[32px]"
            assetLogoUrl={token.tokenDetails.logo ?? githubUnknownTokenLogoUrl}
          />
          <div>
            <div css={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
              <Text.Body alpha="high" css={{ fontWeight: 600, fontSize: '16px' }}>
                {token.tokenDetails.symbol}
              </Text.Body>
              <AssetNetworksLogoStack token={token} max={8} />
            </div>
            {token.rate !== undefined && (
              <Text.Body>
                <AnimatedFiatNumber end={token.rate.price} />
              </Text.Body>
            )}
          </div>
        </div>
      </td>
      <td
        align="right"
        valign="middle"
        css={{
          display: 'none',
          '@media (min-width: 1024px)': {
            display: 'table-cell',
          },
        }}
      >
        {token.locked && (
          <AssetBalance
            fiat={token.overallLockedFiatAmount}
            planck={token.overallLockedAmount}
            symbol={token.tokenDetails.symbol}
            locked={token.locked}
            stale={token.stale}
          />
        )}
      </td>
      <td
        align="right"
        valign="middle"
        css={{
          '> div': {
            paddingRight: '16px',
          },
        }}
      >
        <AssetBalance
          fiat={lockedAsset ? token.overallLockedFiatAmount : token.overallTransferableFiatAmount}
          planck={lockedAsset ? token.overallLockedAmount : token.overallTransferableAmount}
          symbol={token.tokenDetails.symbol}
          stale={token.stale}
        />
      </td>
    </tr>
  )
}

export type AssetsListProps = {
  isLoading?: boolean
  children?: ReactElement<AssetProps> | Array<ReactElement<AssetProps>>
}

export const AssetsList = ({ isLoading, children }: AssetsListProps) => (
  <HiddenDetails overlay={<Text.H3>No assets found</Text.H3>} hidden={!isLoading && isEmpty(children)}>
    <Table css={{ td: { backgroundColor: useSurfaceColor() } }}>
      <thead>
        <tr>
          <th>Asset</th>
          <th
            align="right"
            css={{
              display: 'none',
              '@media (min-width: 1024px)': {
                display: 'table-cell',
              },
            }}
          >
            Locked
          </th>
          <th align="right">Available</th>
        </tr>
      </thead>
      <tbody>
        {/* if is loading and no children, show an array of 8 asset skeleton. if not loading and no children show empty div, else map children */}
        {isLoading && isEmpty(children)
          ? Array(8)
              .fill(0)
              .map((_, i) => <AssetSkeleton key={i} />)
          : !isLoading && isEmpty(children)
          ? Array(8)
              .fill(0)
              .map((_, i) => <AssetSkeleton key={i} loading={false} />)
          : Children.map(children, child => child !== undefined && child)}
      </tbody>
    </Table>
  </HiddenDetails>
)

export const AssetsListLocked = ({ isLoading, children }: AssetsListProps) => (
  <Table>
    <thead>
      <tr>
        <th>Asset</th>
        <th align="right">Locked</th>
      </tr>
    </thead>
    <tbody>
      {isLoading
        ? // map out array of 3 to render skeleton rows
          Array(3)
            .fill(0)
            .map((_, index) => <AssetSkeleton key={index} />)
        : Children.map(children, child => child !== undefined && child)}
    </tbody>
  </Table>
)

export type AssetBalanceProps = {
  planck: string
  fiat: number
  tooltip?: ReactNode
  symbol: string
  locked?: boolean
  stale?: boolean
}

export const AssetBalance = ({ planck, fiat, symbol, locked, stale }: AssetBalanceProps) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '0.4rem',
      height: '100%',
    }}
  >
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      <Text.Body
        alpha={locked ? 'medium' : 'high'}
        css={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25em',
          margin: 0,
          fontSize: '16px',
        }}
      >
        <RedactableBalance>{planck ? `${planck} ${symbol} ` : '- ' + symbol}</RedactableBalance>
        {stale && (
          <Tooltip
            content={
              <>
                Latest balance not available.
                <br />
                Displayed value may be out of date.
              </>
            }
          >
            <AlertTriangle size="0.75em" css={{ color: '#FD8FFF', verticalAlign: 'baseline' }} />
          </Tooltip>
        )}
      </Text.Body>
      {locked ? <Lock css={{ width: '16px', height: '16px' }} /> : ''}
    </div>
    <Text.Body
      css={{
        margin: 0,
        fontSize: '14px',
      }}
    >
      {fiat ? <AnimatedFiatNumber end={fiat} /> : ''}
    </Text.Body>
  </div>
)

const AssetSkeleton = ({ loading = true }: { loading?: boolean }) => (
  <tr
    className="asset skeleton"
    css={{
      '.shimmer': {
        animation: loading ? `${shimmer} 1s infinite` : '',
        background: loading
          ? `linear-gradient(90deg, rgb(38, 38, 38) 4%, rgb(58, 58, 58) 25%, rgb(38, 38, 38) 36%)`
          : 'rgb(38, 38, 38)',
        backgroundSize: '200% 100%',
      },
    }}
  >
    <td valign="top">
      {/* First Column */}
      <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div
          className="shimmer"
          css={{
            width: '2em',
            height: '2em',
            borderRadius: '50%',
            margin: '16px',
          }}
        />
        <div css={{ flex: 1, alignItems: 'stretch', display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
          <div
            className="shimmer"
            css={{
              maxWidth: '150px',
              height: '1em',
              borderRadius: '12px',
            }}
          />
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              // if not first child margin negative left
              '& > :not(:first-child)': {
                marginLeft: '-0.2em',
              },
            }}
          >
            <div
              className="shimmer"
              css={{
                width: '100%',
                maxWidth: '100px',
                height: '1em',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>
      </div>
    </td>
    <td
      align="right"
      valign="middle"
      css={{
        display: 'none',
        '@media (min-width: 1024px)': {
          display: 'table-cell',
        },
      }}
    ></td>
    <td align="right" valign="middle">
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4em',
          alignItems: 'flex-end',
          marginRight: '16px',
        }}
      >
        <div
          className="shimmer"
          css={{
            width: '150px',
            height: '1em',
            borderRadius: '12px',
          }}
        />
        <div
          className="shimmer"
          css={{
            width: '150px',
            height: '1em',
            borderRadius: '12px',
          }}
        />
      </div>
    </td>
  </tr>
)

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
`

const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const Table = styled.table`
  border-spacing: 0 0;
  border-collapse: separate;
  width: 100%;
  text-align: left;
  font-weight: 400;
  font-size: 1.6rem;

  th {
    font-size: 1.4rem;
    font-weight: 400;
    padding-bottom: 1rem;
  }

  td {
    padding: 0;
    width: 33.333%;
  }

  tbody tr.asset {
    :not(.skeleton) {
      cursor: pointer;
    }

    td {
      .logo-stack .logo-circle {
        border-color: ${({ theme }) => theme.color.outline};
      }

      border-top: 1px solid #262626;
    }

    :not(.skeleton):hover td {
      filter: brightness(1.2);
    }

    :first-of-type {
      > td {
        border-top: none;
      }

      > td:first-of-type {
        border-top-left-radius: 0.8rem;
      }

      > td:nth-last-of-type(2) {
        border-top-right-radius: 0.8rem;
      }

      @media (min-width: 1024px) {
        > td:last-of-type {
          border-top-right-radius: 0.8rem;
        }

        > td:nth-last-of-type(2) {
          border-top-right-radius: 0;
        }
      }
    }

    :last-of-type {
      > td {
        border-bottom: 0;
      }

      > td:first-of-type {
        border-bottom-left-radius: 0.8rem;
      }

      > td:nth-last-of-type(2) {
        border-bottom-right-radius: 0.8rem;
      }

      @media (min-width: 1024px) {
        > td:last-of-type {
          border-bottom-right-radius: 0.8rem;
        }

        > td:nth-last-of-type(2) {
          border-bottom-right-radius: 0;
        }
      }
    }
  }

  .noPadRight {
    padding-right: 0;
  }
`
