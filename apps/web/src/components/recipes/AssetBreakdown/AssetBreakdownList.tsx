import { selectedAccountsState } from '@domains/accounts/recoils'
import styled from '@emotion/styled'
import { BalanceFormatter, type Balances } from '@talismn/balances'
import { formatDecimals } from '@talismn/util'
import { useRecoilValue, waitForAll } from 'recoil'

import { AssetBreakdownRow, AssetBreakdownRowHeader } from './AssetBreakdownRow'
import { selectedCurrencyState } from '@domains/balances'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    font-size: 1.4rem;
    font-weight: 400;
    text-align: right;
    padding-right: 1.6rem;
  }

  td:nth-of-type(1),
  th:nth-of-type(1) {
    width: 60%;
  }

  td:nth-of-type(2),
  th:nth-of-type(2) {
    width: 20%;

    @media (min-width: 768px) {
      display: table-cell;
    }

    display: none;
  }

  td:nth-of-type(3),
  th:nth-of-type(3) {
    width: 20%;
  }

  // have the first and last child in the tbody have rounded corners
  tbody > tr:first-child > div {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background-color: #262626;
    animation: none;
  }

  tbody > tr:last-child > div {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`

export const AssetBreakdownListHeader = () => (
  <Table>
    <thead>
      <tr>
        <th></th>
        <th>Locked</th>
        <th>Available</th>
      </tr>
    </thead>
  </Table>
)

type AssetBreakdownListProps = {
  isLoading?: boolean
  balances?: Balances
  isOrml?: boolean
  token: any
}

export const AssetBreakdownList = (props: AssetBreakdownListProps) => {
  const { token, balances } = props
  const [accounts, currency] = useRecoilValue(waitForAll([selectedAccountsState, selectedCurrencyState]))

  return (
    <Table>
      <tbody>
        <AssetBreakdownRowHeader token={token} isOrml />
        {accounts.map((account, index) => {
          const tokenBalance = balances?.find({ tokenId: token?.tokenDetails?.id, address: account.address })

          if (
            !tokenBalance ||
            tokenBalance?.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0')) ===
              BigInt('0')
          ) {
            return null
          }

          const planckAmount = formatDecimals(
            new BalanceFormatter(
              tokenBalance.sorted.reduce((sum, balance) => sum + balance.transferable.planck, BigInt('0')),
              token?.tokenDetails?.decimals
            ).tokens
          )

          const fiatAmount = tokenBalance?.sum?.fiat(currency)?.transferable

          const assetSummary = {
            planckAmount,
            fiatAmount,
            isLocked: false,
            account,
            symbol: token?.tokenDetails?.symbol,
            variant: 'available',
          }

          return <AssetBreakdownRow key={index} assetSummary={assetSummary} />
        })}
        {accounts.map((account, index) => {
          const tokenBalance = balances?.find({ tokenId: token?.tokenDetails?.id, address: account.address })

          if (
            !tokenBalance ||
            tokenBalance?.sorted.reduce((sum, balance) => sum + balance.locked.planck, BigInt('0')) === BigInt('0')
          ) {
            return null
          }

          const planckAmount = formatDecimals(
            new BalanceFormatter(
              tokenBalance.sorted.reduce((sum, balance) => sum + balance.locked.planck, BigInt('0')),
              token?.tokenDetails?.decimals
            ).tokens
          )

          const fiatAmount = tokenBalance?.sum?.fiat(currency)?.locked

          const assetSummary = {
            planckAmount,
            fiatAmount,
            account,
            symbol: token?.tokenDetails?.symbol,
            variant: 'locked',
          }

          return <AssetBreakdownRow key={index} assetSummary={assetSummary} />
        })}
      </tbody>
    </Table>
  )
}
