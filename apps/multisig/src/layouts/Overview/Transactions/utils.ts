import { Transaction__deprecated } from '.'

export function groupTransactionsByDay(
  transactions: Transaction__deprecated[]
): Array<[string, Transaction__deprecated[]]> {
  const groupedTransactions: Record<string, Transaction__deprecated[]> = {}

  for (const transaction of transactions) {
    const date = new Date(transaction.createdTimestamp)
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

    ;(groupedTransactions[dayFormatted] as Transaction__deprecated[]).push(transaction)
  }

  const sortedEntries = Object.entries(groupedTransactions).sort((a, b) => {
    const dateA = new Date(a[0])
    const dateB = new Date(b[0])
    return dateA.getTime() - dateB.getTime()
  })

  return sortedEntries
}

export const formattedHhMm = (d: Date) =>
  d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
