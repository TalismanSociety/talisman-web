export type ChartVariant = 'small' | 'large'
export type ChartSpan = 'H' | 'D' | 'W' | 'M' | 'Y' | 'A'
export type ChartSpanConfig = {
  label: string
  days: string // number as string, also supports "max"
  time: boolean
}
