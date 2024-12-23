export const truncateAddress = (address?: string | null, start = 4, end = 4) =>
  typeof address === 'string' ? `${address.slice(0, start)}…${address.slice(-end)}` : ''
