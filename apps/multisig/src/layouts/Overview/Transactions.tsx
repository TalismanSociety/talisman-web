import { css } from '@emotion/css'
import { useState } from 'react'

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

const Pending = () => {
  return <div>pending</div>
}

const History = () => {
  return <div>pending</div>
}

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  const mode = useState(Mode.Pending)
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
      {}
    </section>
  )
}

export default Transactions
