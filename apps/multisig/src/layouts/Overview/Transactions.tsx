import { css } from '@emotion/css'
import { ArrowUp, Share2 } from '@talismn/icons'
import { formatUsd } from '@util/numbers'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'

import { Token } from '../../domain/chains'

enum Mode {
  Pending,
  History,
}

export enum TransactionType {
  MultiSend,
  Transfer,
}

export interface Transaction {
  timestamp: Date
  description: string
  hash: string
  chainId: number
  approvals: {
    [key: string]: boolean
  }
  decoded: {
    type: TransactionType
    outgoingToken: {
      token: Token
      amount: number
      price: number
    }
    recipients?: [string, number][]
  }
  raw: string
}

export function groupTransactionsByDay(transactions: Transaction[]): Array<[string, Transaction[]]> {
  const groupedTransactions: Record<string, Transaction[]> = {}

  for (const transaction of transactions) {
    const date = new Date(transaction.timestamp)
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
    return dateA.getTime() - dateB.getTime()
  })

  return sortedEntries
}

const formattedHhMm = (d: Date) =>
  d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

const Pending = ({ transactions }: { transactions: Transaction[] }) => {
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDay(transactions)
  }, [transactions])
  return (
    <div
      className={css`
        display: grid;
        gap: 16px;
      `}
    >
      {groupedTransactions.map(([day, transactions]) => (
        <div>
          <p>{day}</p>
          {transactions.map(t => (
            <div
              className={css`
                display: grid;
                align-items: center;
                padding: 12px 16px;
                grid-template-columns: 44px 1fr 1fr;
                grid-template-rows: 16px 16px;
                grid-template-areas:
                  'icon description tokenAmount'
                  'icon time usdAmount';
                p {
                  margin-top: 4px;
                }
              `}
            >
              <div
                className={css`
                  grid-area: icon;
                  display: grid;
                  align-items: center;
                  justify-content: center;
                  height: 32px;
                  width: 32px;
                  border-radius: 100px;
                  background-color: var(--color-backgroundLighter);
                  svg {
                    height: 15px;
                    width: 15px;
                    color: var(--color-primary);
                  }
                `}
              >
                {t.decoded.type === TransactionType.MultiSend ? <Share2 /> : <ArrowUp />}
              </div>
              <p css={{ gridArea: 'description', color: 'var(--color-offWhite)' }}>{t.description}</p>
              <p css={{ gridArea: 'time', fontSize: '14px', paddingTop: '4px' }}>{formattedHhMm(t.timestamp)}</p>
              <p css={{ gridArea: 'tokenAmount', textAlign: 'right', color: 'var(--color-offWhite)' }}>
                {t.decoded.outgoingToken.amount} {t.decoded.outgoingToken.token.symbol}
              </p>
              <p css={{ gridArea: 'usdAmount', textAlign: 'right', fontSize: '14px', paddingTop: '4px' }}>
                {formatUsd(t.decoded.outgoingToken.amount * t.decoded.outgoingToken.price)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const History = ({ transactions }: { transactions: Transaction[] }) => {
  return <div>history</div>
}

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  const pendingTransactions = useMemo(() => {
    return transactions.filter(t => Object.values(t.approvals).some(a => !a))
  }, [transactions])
  const completedTransactions = useMemo(() => {
    return transactions.filter(t => Object.values(t.approvals).every(a => a))
  }, [transactions])

  const [mode, setMode] = useState(Mode.Pending)
  return (
    <section
      className={css`
        grid-area: transactions;
        background-color: var(--color-grey800);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 24px;
      `}
    >
      <div
        className={css`
          display: flex;
          gap: 12px;
          font-weight: bold !important;
          > h2 {
            cursor: pointer;
          }
        `}
      >
        <h2
          onClick={() => setMode(Mode.Pending)}
          css={{ fontWeight: 'bold', color: mode === Mode.Pending ? 'var(--color-offWhite)' : '' }}
        >
          Pending
        </h2>
        <h2
          onClick={() => setMode(Mode.History)}
          css={{ fontWeight: 'bold', color: mode === Mode.History ? 'var(--color-offWhite)' : '' }}
        >
          History
        </h2>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {mode === Mode.Pending ? (
            <Pending transactions={pendingTransactions} />
          ) : (
            <History transactions={completedTransactions} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export default Transactions
