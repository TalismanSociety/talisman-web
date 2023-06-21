import { Transaction } from '@domains/multisig'

export function groupTransactionsByDay(transactions: Transaction[]): Array<[string, Transaction[]]> {
  const groupedTransactions: Record<string, Transaction[]> = {}

  for (const transaction of transactions) {
    const { date } = transaction
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayFormatted = day.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    if (!groupedTransactions[dayFormatted]) {
      groupedTransactions[dayFormatted] = []
    }

    ;(groupedTransactions[dayFormatted] as Transaction[]).push(transaction)
  }

  const sortedEntries = Object.entries(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a[0])
    const dateB = new Date(b[0])
    return dateB.getTime() - dateA.getTime()
  })

  //sort the transactions within each day
  for (const entry of sortedEntries) {
    entry[1].sort((a, b) => {
      return b.date.getTime() - a.date.getTime()
    })
  }

  return sortedEntries
}

export const formattedHhMm = (d: Date) =>
  d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

export const formattedDate = (d: Date) =>
  d.toLocaleTimeString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
