export const truncateAddress = (addr, start = 6, end = 4) =>
  addr ? `${addr.substring(0, start)}...${addr.substring(addr.length - end)}` : null
export const truncateString = (str = '', start = 10, end = 0) =>
  str && str.length
    ? str.length <= start + end
      ? str
      : `${str.substring(0, start)}...` + (end > 0 ? str.substring(str.length - end) : '')
    : null
export const unitPrefixes = [
  { multiplier: 1e-24, symbol: 'y' },
  { multiplier: 1e-21, symbol: 'z' },
  { multiplier: 1e-18, symbol: 'a' },
  { multiplier: 1e-15, symbol: 'f' },
  { multiplier: 1e-12, symbol: 'p' },
  { multiplier: 1e-9, symbol: 'n' },
  { multiplier: 1e-6, symbol: 'μ' },
  { multiplier: 1e-3, symbol: 'm' },
  { multiplier: 1, symbol: '' },
  { multiplier: 1e3, symbol: 'k' },
  { multiplier: 1e6, symbol: 'M' },
  { multiplier: 1e9, symbol: 'G' },
  { multiplier: 1e12, symbol: 'T' },
  { multiplier: 1e15, symbol: 'P' },
  { multiplier: 1e18, symbol: 'E' },
  { multiplier: 1e21, symbol: 'Z' },
  { multiplier: 1e24, symbol: 'Y' },
]
export const shortNumber = (num, decimals = 2) => {
  if (!num) return

  const prefix = unitPrefixes
    .slice()
    .reverse()
    .find(({ multiplier }) => multiplier <= num)

  if (!prefix) return num.toFixed(decimals)

  return (num / prefix.multiplier).toFixed(decimals).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + prefix.symbol
}
export const shortCurrency = (val, props) => {
  const prefix = unitPrefixes
    .slice()
    .reverse()
    .find(({ multiplier }) => multiplier <= val)

  if (!prefix) return formatCurrency(val, props)

  const parts = formatCurrencyToParts(val / prefix.multiplier, props)
  for (const part of parts) {
    if (part.type !== 'currency') continue
    part.value = `${prefix.symbol}${part.value}`
  }

  return parts.map(({ value }) => value).join('')
}
export const formatCurrency = (val, props) =>
  formatCurrencyToParts(val, props)
    .map(({ value }) => value)
    .join('')
export const formatCurrencyToParts = (val, props) =>
  new Intl.NumberFormat(props?.locale || 'en-US', {
    style: 'currency',
    currency: props?.currency || 'USD',
    currencyDisplay: 'symbol',
  }).formatToParts(val || 0)
export const formatCommas = (val, props) =>
  new Intl.NumberFormat(props?.locale || 'en-US', {
    maximumFractionDigits: props?.maximumFractionDigits || 4,
  }).format(val)
export const isMobileBrowser = () =>
  // Method taken from https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop
  (navigator.userAgent || navigator.vendor || window.opera).includes('Mobi')
