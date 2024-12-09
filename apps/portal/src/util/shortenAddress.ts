export const shortenAddress = (address: string, padding = 4) =>
  `${address.slice(0, padding)}…${address.slice(-padding)}`
