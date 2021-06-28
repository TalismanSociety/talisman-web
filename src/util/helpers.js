export const truncateAddress = (addr, start=6, end=4) => addr ? `${addr.substring(0, start)}...${addr.substring(addr.length - end)}` : null
export const truncateString = (str='', start=10, end=0) => str && str.length ? (str.length <= (start + end) ? str : `${str.substring(0, start)}...` + (end > 0 ? str.substring(str.length - end) : '')) : null
export const shortNumber = (num, decimals=2) => {
  if (!num) return
  if (num < 1000) return num.toFixed(decimals);
  
  const si = [{v: 1E3, s: "K"},{v: 1E6, s: "M"},{v: 1E9, s: "B"},{v: 1E12, s: "T"},{v: 1E15, s: "P"},{v: 1E18, s: "E"}]
  let i

  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].v) break;
  }

  return (num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s;
}