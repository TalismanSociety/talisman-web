import PortfolioAllocationGraphComponent from '@components/recipes/PortfolioAllocationGraph'
import { selectedBalancesState, selectedCurrencyState, totalSelectedAccountsFiatBalance } from '@domains/balances'
import { HiddenDetails, Text } from '@talismn/ui'
import { groupBy } from 'lodash'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { selector, useRecoilValue } from 'recoil'
import AnimatedFiatNumber from './AnimatedFiatNumber'

const assetDataState = selector({
  key: 'PortfolioAllocationGraph/AssetData',
  get: ({ get }) => {
    const balances = get(selectedBalancesState)
    const currency = get(selectedCurrencyState)

    const nonZeroBalance = Object.entries(
      groupBy(
        balances?.sorted
          .map(x => ({
            symbol: x.token?.symbol ?? x.id,
            total: x.total.fiat(currency) ?? 0,
            color: x.token?.themeColor ?? x.chain?.themeColor ?? x.evmNetwork?.themeColor,
          }))
          .filter(x => x.total > 0),
        x => x.symbol
      )
    )
      .map(([key, value]) => ({
        symbol: key,
        color: value[0]?.color,
        total: value.reduce((previous, current) => previous + current.total, 0),
      }))
      .map(x => ({ ...x, percent: x.total / get(totalSelectedAccountsFiatBalance) }))

    const displayableBalance = nonZeroBalance?.filter(x => x.percent > 0.05).sort((a, b) => b.total - a.total)
    const displayableBalanceTotal = displayableBalance?.reduce((previous, current) => previous + current.total, 0)
    const otherBalanceTotal = get(totalSelectedAccountsFiatBalance) - (displayableBalanceTotal ?? 0)
    const otherBalancePercent = otherBalanceTotal / get(totalSelectedAccountsFiatBalance)

    if (displayableBalance === undefined || displayableBalanceTotal === undefined) {
      return []
    }

    return [
      ...displayableBalance,
      ...(otherBalanceTotal === 0
        ? []
        : [{ symbol: 'Other', total: otherBalanceTotal, percent: otherBalancePercent, color: undefined }]),
    ]
  },
})

const stateDataState = selector({
  key: 'PortfolioAllocationGraph/StateData',
  get: ({ get }) => {
    const balances = get(selectedBalancesState)
    const fiatSum = balances?.sum.fiat(get(selectedCurrencyState))

    return { transferable: fiatSum?.transferable, reserved: fiatSum?.reserved, locked: fiatSum?.locked }
  },
})

const SuspendablePortfolioAllocationGraph = () => {
  const assetData = useRecoilValue(assetDataState)
  const stateData = useRecoilValue(stateDataState)

  const [displayData, setDisplayData] = useState<'asset' | 'state'>()

  const renderPercent = (value: number) => value.toLocaleString(undefined, { style: 'percent' })

  const parsedAssetData = useMemo(
    () =>
      assetData.map(x => ({
        label: x.symbol,
        value: x.percent,
        renderValue: renderPercent,
        color: x.color ?? '#5A5A5A',
      })) ?? [],
    [assetData]
  )

  const renderFiat = (value: number) => <AnimatedFiatNumber end={value} />

  const parsedStateData = useMemo(
    () =>
      [
        { label: 'Available', value: stateData.transferable ?? 0, renderValue: renderFiat, color: '#FD8FFF' },
        { label: 'Reserved', value: stateData.reserved ?? 0, renderValue: renderFiat, color: '#FD4848' },
        { label: 'Locked', value: stateData.locked ?? 0, renderValue: renderFiat, color: '#D5FF5C' },
      ].filter(x => x.value > 0),
    [stateData.locked, stateData.reserved, stateData.transferable]
  )

  return (
    <HiddenDetails hidden={assetData.length === 0} overlay={<Text.H3>No assets found</Text.H3>}>
      <PortfolioAllocationGraphComponent
        assetChip={
          <PortfolioAllocationGraphComponent.AssetChip onClick={useCallback(() => setDisplayData('asset'), [])} />
        }
        stateChip={
          <PortfolioAllocationGraphComponent.StateChip onClick={useCallback(() => setDisplayData('state'), [])} />
        }
        data={displayData === 'state' ? parsedStateData : parsedAssetData}
      />
    </HiddenDetails>
  )
}

const PortfolioAllocationGraph = () => (
  <Suspense fallback={<PortfolioAllocationGraphComponent.Skeleton />}>
    <SuspendablePortfolioAllocationGraph />
  </Suspense>
)

export default PortfolioAllocationGraph
