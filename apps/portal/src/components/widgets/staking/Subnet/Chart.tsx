import ChartJs, { ActiveElement, ChartComponentLike, ChartEvent } from 'chart.js/auto'
import { FC, useEffect, useRef } from 'react'

import { CHART_TIMESPANS } from './constants'
import { ChartSpan, ChartVariant } from './types'

export const Chart: FC<{
  prices: [number, number][]
  timespan: ChartSpan
  variant: ChartVariant
  onHoverValueChange: (price: number | null) => void
}> = ({ prices, timespan, variant, onHoverValueChange }) => {
  const refChart = useRef<HTMLCanvasElement>(null)
  const currency = 'usd'

  useEffect(() => {
    const canvas = refChart.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // set min boundaries for y axis to ensure that timespan selector isn't drawn on the price line
    const allPrices = prices.map(([, price]) => price)
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const suggestedMin = minPrice - (maxPrice - minPrice) * 0.25

    // sometimes chart's onHover is called after mouse has left the canvas, so we need to track this
    let isHovering = false

    const onMouseEnter = () => {
      isHovering = true
    }
    const onMouseLeave = () => {
      isHovering = false
      onHoverValueChange(null)
    }

    canvas.addEventListener('mouseenter', onMouseEnter)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const onHover = (event: ChartEvent, elements: ActiveElement[]) => {
      if (!isHovering || !elements.length) return
      try {
        const element = elements[0]
        const price = allPrices[element?.index || 0]
        onHoverValueChange(price || 0)
      } catch (e) {
        console.warn('Failed to read hovered price', { event, elements })
        onHoverValueChange(null)
      }
    }

    // Create a gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height)
    gradient.addColorStop(0, 'rgba(213, 255, 92, 0.2)') // Start color (top)
    gradient.addColorStop(1, 'rgba(213, 255, 92, 0)') // End color (bottom)

    const chart = new ChartJs(canvas, {
      type: 'line',
      options: {
        onHover,
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          },
        },
        interaction: {
          // controls activeElements for onHover
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            displayColors: false,
            backgroundColor: '#2E3221',
            titleColor: '#d5ff5c',
            titleFont: {
              size: variant === 'large' ? 14 : 12,
              weight: 400,
            },
            titleMarginBottom: 0,
            caretSize: 0,
            caretPadding: 40,
            yAlign: 'bottom',
            callbacks: {
              title: function (tooltipItems) {
                const dateLabel = tooltipItems?.[0]?.label
                const date = dateLabel ? new Date(dateLabel) : new Date()
                return CHART_TIMESPANS[timespan]?.time
                  ? `${date.toLocaleDateString(undefined, { dateStyle: 'short' })} ${date.toLocaleTimeString(
                      undefined,
                      { timeStyle: 'short' }
                    )}`
                  : date.toLocaleDateString(undefined, { dateStyle: 'short' })
              },
              label: function () {
                return ''
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              display: false,
              align: 'start',
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
          y: {
            suggestedMin,
            ticks: {
              display: false,
              align: 'start',
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
        },
      },

      data: {
        labels: prices.map(([timestamp]) => new Date(timestamp)),
        datasets: [
          {
            label: 'Price',
            data: allPrices,
            borderColor: '#d5ff5c',
            pointRadius: 0,
            tension: 0.1,
            fill: true,
            backgroundColor: gradient,
            borderWidth: 2,
          },
        ],
      },
    })

    return () => {
      canvas.removeEventListener('mouseenter', onMouseEnter)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      chart.destroy()
    }
  }, [currency, onHoverValueChange, prices, refChart, timespan, variant])

  return <canvas ref={refChart}></canvas>
}
