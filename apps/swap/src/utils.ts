export const shortenAddress = (address: string, padding = 4) =>
  `${address.slice(0, padding)}...${address.slice(-padding)}`

export const sleep = async (ms: number) => await new Promise<void>(resolve => setTimeout(() => resolve(), ms))
