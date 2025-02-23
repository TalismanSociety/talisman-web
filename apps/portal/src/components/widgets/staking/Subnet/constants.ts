import { ChartSpanConfig } from './types'

export const CHART_TIMESPANS: Record<string, ChartSpanConfig> = {
  H: {
    label: '1H',
    days: '1',
    time: true,
  },
  D: {
    label: '1D',
    days: '2',
    time: true,
  },
  W: {
    label: '1W',
    days: '7',
    time: true,
  },
  M: {
    label: '1M',
    days: '30',
    time: false,
  },
  Y: {
    label: '1Y',
    days: '365',
    time: false,
  },
  A: {
    label: 'ALL',
    days: 'max',
    time: false,
  },
}
