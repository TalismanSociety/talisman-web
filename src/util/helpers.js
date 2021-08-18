export const truncateAddress = (addr, start = 6, end = 4) =>
  addr ? `${addr.substring(0, start)}...${addr.substring(addr.length - end)}` : null
export const truncateString = (str = '', start = 10, end = 0) =>
  str && str.length
    ? str.length <= start + end
      ? str
      : `${str.substring(0, start)}...` + (end > 0 ? str.substring(str.length - end) : '')
    : null
export const shortNumber = (num = 0, decimals = 2) => {
  if (typeof num !== 'number') return
  if (num < 1000) return parseFloat(num.toFixed(decimals))

  const si = [
    { v: 1e3, s: 'K' },
    { v: 1e6, s: 'M' },
    { v: 1e9, s: 'B' },
    { v: 1e12, s: 'T' },
    { v: 1e15, s: 'P' },
    { v: 1e18, s: 'E' },
  ]
  let i

  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].v) break
  }

  return (num / si[i].v).toFixed(decimals).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].s
}
export const formatCurrency = (val, props) =>
  new Intl.NumberFormat(props?.locale || 'en-US', {
    style: 'currency',
    currency: props?.currency || 'USD',
    currencyDisplay: 'symbol',
  }).format(val || 0)
export const formatCommas = (val, props) =>
  new Intl.NumberFormat(props?.locale || 'en-US', {
    maximumFractionDigits: 4,
  }).format(val)
