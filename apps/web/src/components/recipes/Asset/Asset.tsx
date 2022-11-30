import { Lock } from '@components/atoms/Icon'
import Text from '@components/atoms/Text'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Balance, BalanceFormatter, Balances } from '@talismn/balances'
import { Token } from '@talismn/chaindata-provider'
import { formatDecimals } from '@talismn/util'
import { Children, ReactElement, ReactNode } from 'react'

type AssetBalanceProps = {
  locked?: boolean
  planck: string
  fiat: string
  tooltip?: ReactNode
  symbol: string
}

const AssetBalance = ({ locked, planck, fiat, tooltip, symbol }: AssetBalanceProps) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '0.4rem',
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
          css={{
            margin: 0,
            color: locked ? '#a5a5a5' : 'var(--color-text)',
            fontSize: '16px',
          }}
        >
          {`${planck.toLocaleString()} ${symbol} `}
        </Text.Body>
        {locked ? <Lock css={{ width: '16px', height: '16px' }} /> : ''}
      </div>
      <Text.Body
        css={{
          margin: 0,
          color: '#a5a5a5',
          fontSize: '14px',
        }}
      >
        {fiat ? `$${fiat.toLocaleString()}` : ''}
      </Text.Body>
    </div>
  )
}

export type AssetProps = {
  className?: string
  token: Token
  balances: Balances | undefined
  address: string | undefined
}

const Asset = Object.assign((props: AssetProps) => {
  const theme = useTheme()
  const { token, balances, address } = props

  const tokenBalances =
    address !== undefined
      ? balances?.find([{ address: address, tokenId: token.id }])
      : balances?.find({ tokenId: token.id })
  if (!tokenBalances) return null

  const tokenAmount = tokenBalances.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0'))
  if (tokenAmount === BigInt('0')) return null

  const tokenAmountFormatted = formatDecimals(new BalanceFormatter(tokenAmount, token.decimals).tokens)

  const fiatAmount =
    (balances?.find({ tokenId: token.id }).sum.fiat('usd').transferable ?? 0).toLocaleString(undefined, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
    }) ?? '-'

  const isOrml = token.type === 'substrate-orml'

  const chainName = tokenBalances?.sorted[0]?.chain?.name ?? tokenBalances?.sorted[0]?.evmNetwork?.name

  if (tokenBalances.sorted[0] === undefined) {
    return null
  }

  const chainType = getNetworkType(tokenBalances.sorted[0])

  return (
    <tr className="asset">
      <td valign="top">
        {/* First Column */}
        <div css={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <img
            src={token?.logo}
            css={{
              width: '2em',
              height: '2em',
              borderRadius: '50%',
              margin: '16px',
            }}
            alt={' logo'}
          />
          <div css={{ display: 'flex', flexDirection: 'column', gap: '0.4em' }}>
            <Text.Body css={{ fontWeight: 600, fontSize: '16px', color: theme.color.onSurface }}>
              {chainName} <span css={{ color: '#a5a5a5', fontWeight: 200 }}>({token?.symbol})</span>
            </Text.Body>
            <div
              css={{
                'display': 'flex',
                'flexDirection': 'row',
                // if not first child margin negative left
                '& > :not(:first-child)': {
                  marginLeft: '-0.2em',
                },
              }}
            >
              {/* array of 4 small images */}
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div css={{ width: '1em', height: '1em', borderRadius: '50%', background: 'black' }}>
                    <img
                      src={token?.logo}
                      css={{ width: '100%', height: '100%', borderRadius: '50%' }}
                      alt={'' + ' logo'}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </td>
      <td
        align="right"
        valign="middle"
        css={{
          'display': 'none',
          '@media (min-width: 1024px)': {
            display: 'table-cell',
          },
        }}
      >
        {/* { token.locked && <AssetBalance 
          fiat={fiatAmount}
          planck={tokenAmountFormatted}   
          // locked={token.locked}
          symbol={token?.symbol}
        />} */}
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
        <AssetBalance fiat={fiatAmount} planck={tokenAmountFormatted} symbol={token.symbol} />
      </td>
    </tr>
  )
})

const Table = styled.table`
  border-spacing: 0 0;
  border-collapse: separate;
  width: 100%;
  color: var(--color-mid);
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
  }

  tbody tr.asset {
    :not(.skeleton) {
      cursor: pointer;
    }

    td {
      background: rgb(27, 27, 27);
      .logo-stack .logo-circle {
        border-color: rgb(27, 27, 27);
      }

      border-top: 1px solid #262626;
    }

    :not(.skeleton):hover td {
      background: rgb(38, 38, 38);
      .logo-stack .logo-circle {
        border-color: rgb(38, 38, 38);
      }
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

export type AssetsListProps = {
  children?: ReactElement<AssetProps> | ReactElement<AssetProps>[]
}

export const AssetsList = (props: AssetsListProps) => {
  const theme = useTheme()
  return (
    <Table>
      <thead>
        <tr>
          <th>Asset</th>
          <th
            align="right"
            css={{
              'display': 'none',
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
      <tbody>{Children.map(props.children, child => child !== undefined && child)}</tbody>
    </Table>
  )
}

export const AssetsListLocked = (props: AssetsListProps) => {
  const theme = useTheme()
  return (
    <Table>
      <thead>
        <tr>
          <th>Asset</th>
          <th align="right">Locked</th>
        </tr>
      </thead>
      <tbody>{Children.map(props.children, child => child !== undefined && child)}</tbody>
    </Table>
  )
}

function getNetworkType({ chain, evmNetwork }: Balance): string | null {
  if (evmNetwork) return evmNetwork.isTestnet ? 'EVM Testnet' : 'EVM Blockchain'

  if (chain === null) return null

  if (chain.isTestnet) return 'Testnet'
  return chain.paraId ? 'Parachain' : (chain.parathreads ?? []).length > 0 ? 'Relay Chain' : 'Blockchain'
}

export default Asset
