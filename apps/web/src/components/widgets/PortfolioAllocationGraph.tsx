import PortfolioAllocationGraphComponent from '@components/recipes/PortfolioAllocationGraph'
import { legacyBalancesState, totalSelectedAccountsFiatBalance } from '@domains/balances/recoils'
import { groupBy } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { selector, useRecoilValue } from 'recoil'

const assetDataState = selector({
  key: 'PortfolioAllocationGraph/AssetData',
  get: ({ get }) => {
    const balances = get(legacyBalancesState).balances

    const nonZeroBalance = Object.entries(
      groupBy(
        balances?.sorted
          .map(x => ({
            symbol: x.token?.symbol ?? x.id,
            total: x.total.fiat('usd') ?? 0,
          }))
          .filter(x => x.total > 0),
        x => x.symbol
      )
    )
      .map(([key, value]) => ({ symbol: key, total: value.reduce((previous, current) => previous + current.total, 0) }))
      .map(x => ({ ...x, percent: x.total / get(totalSelectedAccountsFiatBalance) }))

    const displayableBalance = nonZeroBalance?.filter(x => x.percent > 0.05).sort((a, b) => b.total - a.total)
    const displayableBalanceTotal = displayableBalance?.reduce((previous, current) => previous + current.total, 0)
    const otherBalanceTotal = get(totalSelectedAccountsFiatBalance) - (displayableBalanceTotal ?? 0)
    const otherBalancePercent = otherBalanceTotal / get(totalSelectedAccountsFiatBalance)

    if (displayableBalance === undefined || displayableBalanceTotal === undefined) {
      return
    }

    return [
      ...displayableBalance,
      ...(otherBalanceTotal === 0 ? [] : [{ symbol: 'Other', total: otherBalanceTotal, percent: otherBalancePercent }]),
    ]
  },
})

const stateDataState = selector({
  key: 'PortfolioAllocationGraph/StateData',
  get: ({ get }) => {
    const balances = get(legacyBalancesState).balances
    const fiatSum = balances?.sum.fiat('usd')

    return { transferable: fiatSum?.transferable, reserved: fiatSum?.reserved, locked: fiatSum?.locked }
  },
})

const PortfolioAllocationGraph = () => {
  const assetData = useRecoilValue(assetDataState)
  const stateData = useRecoilValue(stateDataState)

  const [displayData, setDisplayData] = useState<'asset' | 'state'>()

  const parsedAssetData = useMemo(
    () => assetData?.map(x => ({ label: x.symbol, value: x.percent, color: 'red' })) ?? [],
    [assetData]
  )

  const parsedStateData = useMemo(
    () =>
      [
        { label: 'Transferable', value: stateData.transferable ?? 0, color: '#FD8FFF' },
        { label: 'Reserved', value: stateData.reserved ?? 0, color: '#FD4848' },
        { label: 'Locked', value: stateData.locked ?? 0, color: '#D5FF5C' },
      ].filter(x => x.value > 0),
    [stateData.locked, stateData.reserved, stateData.transferable]
  )

  return (
    <PortfolioAllocationGraphComponent
      assetChip={
        <PortfolioAllocationGraphComponent.AssetChip onClick={useCallback(() => setDisplayData('asset'), [])} />
      }
      stateChip={
        <PortfolioAllocationGraphComponent.StateChip onClick={useCallback(() => setDisplayData('state'), [])} />
      }
      valueType={displayData === 'state' ? 'currency' : 'percent'}
      data={displayData === 'state' ? parsedStateData : parsedAssetData}
    />
  )
}

export default PortfolioAllocationGraph
