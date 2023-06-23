import { useApproveAsMulti, useAsMulti, useCancelAsMulti, useDecodeCallData } from '@domains/chains'
import { Transaction, selectedMultisigState, useNextTransactionSigner, usePendingTransaction } from '@domains/multisig'
import { css } from '@emotion/css'
import { EyeOfSauronProgressIndicator, FullScreenDialog } from '@talismn/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from './FullScreenSummary'
import TransactionSummaryRow from './TransactionSummaryRow'
import { groupTransactionsByDay } from './utils'

enum Mode {
  Pending,
  History,
}

function extractHash(url: string) {
  const parts = url.split('/')
  const txIndex = parts.indexOf('tx')
  if (txIndex === -1 || txIndex + 1 >= parts.length) {
    return null
  }
  return parts[txIndex + 1]
}

const TransactionsList = ({ transactions }: { transactions: Transaction[] }) => {
  let location = useLocation().pathname
  const navigate = useNavigate()
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDay(transactions)
  }, [transactions])
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const openTransaction = transactions.find(t => t.hash === extractHash(location))
  const nextSigner = useNextTransactionSigner(openTransaction?.approvals)
  const { approveAsMulti, estimatedFee: approveAsMultiEstimatedFee } = useApproveAsMulti(
    nextSigner?.address,
    openTransaction?.hash,
    openTransaction?.rawPending?.multisig.when
  )
  const { decodeCallData } = useDecodeCallData()
  const maybeCallData = (openTransaction?.callData && decodeCallData(openTransaction.callData)) || undefined
  const { asMulti, estimatedFee: asMultiEstimatedFee } = useAsMulti(
    nextSigner?.address,
    maybeCallData,
    openTransaction?.rawPending?.multisig.when
  )
  const { cancelAsMulti, canCancel } = useCancelAsMulti(openTransaction)

  // Handle if user clicks a link to a tx that doesn't exist for them
  useEffect(() => {
    if (!openTransaction && location.includes('tx')) {
      navigate('/overview')
    }
  }, [location, openTransaction, navigate])

  const readyToExecute = useMemo(() => {
    const nApprovals = Object.values(openTransaction?.approvals || {}).filter(a => a).length
    const threshold = selectedMultisig.threshold
    return nApprovals >= threshold - 1
  }, [openTransaction, selectedMultisig.threshold])

  return (
    <div
      className={css`
        display: grid;
        gap: 16px;
      `}
    >
      {groupedTransactions.map(([day, transactions]) => (
        <div key={day}>
          <p>{day}</p>
          {transactions.map(t => {
            return (
              <motion.div key={t.hash} whileHover={{ scale: 1.015 }} css={{ padding: '12px 16px', cursor: 'pointer' }}>
                <TransactionSummaryRow onClick={() => navigate(`/overview/tx/${t.hash}`)} t={t} shortDate={true} />
              </motion.div>
            )
          })}
        </div>
      ))}
      {groupedTransactions.length === 0 && <div>All caught up 🏖️</div>}
      <Routes>
        <Route
          path="/tx/:hash"
          element={
            <FullScreenDialog
              onRequestDismiss={() => {
                navigate('/overview')
              }}
              onClose={() => {
                navigate('/overview')
              }}
              title={<FullScreenDialogTitle t={openTransaction} />}
              css={{
                header: {
                  margin: '32px 48px',
                },
                height: '100vh',
                background: 'var(--color-grey800)',
                maxWidth: '781px',
                minWidth: '700px',
                width: '100%',
                padding: '0 !important',
              }}
              open={!!openTransaction}
            >
              <FullScreenDialogContents
                canCancel={canCancel}
                readyToExecute={readyToExecute}
                fee={readyToExecute ? asMultiEstimatedFee : approveAsMultiEstimatedFee}
                t={openTransaction}
                onApprove={() =>
                  new Promise((resolve, reject) => {
                    if (readyToExecute) {
                      asMulti({
                        onSuccess: () => {
                          navigate('/overview')
                          toast.success('Transaction executed.', { duration: 5000, position: 'bottom-right' })
                          resolve()
                        },
                        onFailure: e => {
                          navigate('/overview')
                          toast.error('Failed to execute transaction.')
                          console.error(e)
                          reject()
                        },
                      })
                    } else {
                      approveAsMulti({
                        onSuccess: () => {
                          navigate('/overview')
                          toast.success('Transaction approved.', { duration: 5000, position: 'bottom-right' })
                          resolve()
                        },
                        onFailure: e => {
                          navigate('/overview')
                          toast.error('Failed to approve transaction.')
                          console.error(e)
                          reject()
                        },
                      })
                    }
                  })
                }
                onCancel={() =>
                  new Promise((resolve, reject) => {
                    cancelAsMulti({
                      onSuccess: () => {
                        navigate('/overview')
                        toast.success('Transaction cancelled.', { duration: 5000, position: 'bottom-right' })
                        resolve()
                      },
                      onFailure: e => {
                        navigate('/overview')
                        toast.error('Failed to cancel transaction.')
                        console.error(e)
                        reject()
                      },
                    })
                  })
                }
              />
            </FullScreenDialog>
          }
        />
      </Routes>
    </div>
  )
}

const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  const { transactions: pendingTransactions, loading: pendingLoading } = usePendingTransaction()
  // Mocks below
  // const pendingTransactions = useMemo(() => {
  //   return transactions.filter(t => Object.values(t.approvals).some(a => !a))
  // }, [transactions])
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
          {mode === Mode.Pending && pendingLoading ? (
            <div css={{ margin: '24px 0' }}>
              <EyeOfSauronProgressIndicator />
            </div>
          ) : (
            <TransactionsList transactions={mode === Mode.Pending ? pendingTransactions : completedTransactions} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export default Transactions
