import { css } from '@emotion/css'
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
  hash: string
  chainId: number
  approvals: {
    [key: string]: boolean
  }
  decoded: {
    type: TransactionType
    outgoingToken?: {
      token: Token
      amount: number
      price: number
    }
    recipients?: [string, number][]
  }
  raw: string
}

const Pending = ({ transactions }: { transactions: Transaction[] }) => {
  return <div>pending</div>
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
