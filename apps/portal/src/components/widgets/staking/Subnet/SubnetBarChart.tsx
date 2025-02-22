import { CandlestickSeries, ColorType, createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'

export const SubnetBarChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const initialData = [
    { time: '2018-12-22', open: 32.51, high: 33.2, low: 32.1, close: 32.95 },
    { time: '2018-12-23', open: 32.95, high: 33.5, low: 31.11, close: 31.8 },
    { time: '2018-12-24', open: 31.8, high: 32.0, low: 27.02, close: 27.32 },
    { time: '2018-12-25', open: 27.32, high: 27.5, low: 26.8, close: 27.1 },
    { time: '2018-12-26', open: 27.1, high: 27.3, low: 25.17, close: 25.5 },
    { time: '2018-12-27', open: 25.5, high: 28.89, low: 25.5, close: 28.0 },
    { time: '2018-12-28', open: 28.0, high: 28.1, low: 25.46, close: 25.46 },
    { time: '2018-12-29', open: 25.46, high: 26.0, low: 23.92, close: 24.0 },
    { time: '2018-12-30', open: 24.0, high: 24.5, low: 22.68, close: 23.0 },
    { time: '2018-12-31', open: 23.0, high: 23.5, low: 22.67, close: 22.67 },
  ]

  const colors = {
    backgroundColor: 'black',
    lineColor: '#2962FF',
    textColor: 'white',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
  }

  const { backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor } = colors

  useEffect(() => {
    if (!chartContainerRef.current) return // ✅ Prevent null reference

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    })
    chart.timeScale().fitContent()

    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    })
    newSeries.setData(initialData)

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [initialData, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor])

  return <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
}
