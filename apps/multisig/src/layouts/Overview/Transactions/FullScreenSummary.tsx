import MemberRow from '@components/MemberRow'
import StatusCircle, { StatusCircleType } from '@components/StatusCircle'
import { Chain, filteredSupportedChains, multisigDepositTotalSelector, tokenPriceState } from '@domains/chains'
import { accountsState } from '@domains/extension'
import { Balance, Transaction, TransactionType, usePendingTransactions } from '@domains/multisig'
import { css } from '@emotion/css'
import { Button, CircularProgressIndicator, Skeleton } from '@talismn/ui'
import { Address } from '@util/addresses'
import { balanceToFloat, formatUsd } from '@util/numbers'
import { useMemo, useState } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import TransactionSummaryRow from './TransactionSummaryRow'
import { useKnownAddresses } from '@hooks/useKnownAddresses'

enum PillType {
  Pending,
  Executed,
}

const Pill = ({ children, type }: { children: React.ReactNode; type: PillType }) => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 4px 8px;
        height: 25px;
        background: ${type === PillType.Pending ? 'rgba(244, 143, 69, 0.25)' : 'rgba(56, 212, 72, 0.25)'};
        color: ${type === PillType.Pending ? 'rgba(244, 143, 69, 1)' : 'rgba(56, 212, 72, 1)'};
        border-radius: 12px;
      `}
    >
      {children}
    </div>
  )
}

const Approvals = ({ t }: { t: Transaction }) => {
  const { contactByAddress } = useKnownAddresses(t.multisig.id)
  return (
    <div css={{ display: 'grid', gap: '14px' }}>
      {Object.entries(t.approvals).map(([encodedAddress, approval]) => {
        const decodedAddress = Address.fromPubKey(encodedAddress)
        if (!decodedAddress) {
          console.error(`Could not decode address in t.approvals!`)
          return null
        }
        const contact = contactByAddress[decodedAddress.toSs58()]
        return (
          <div key={encodedAddress} css={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <div css={{ width: '100%' }}>
              <MemberRow
                member={{ address: decodedAddress, nickname: contact?.name, you: contact?.extensionName !== undefined }}
                chain={t.multisig.chain}
              />
            </div>
            <div
              className={css`
                grid-area: executedInfo;
                margin-left: 24px;
              `}
            >
              <StatusCircle
                type={approval ? StatusCircleType.Success : StatusCircleType.Unknown}
                circleDiameter="24px"
                iconDimentions={{ width: '11px', height: 'auto' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const FullScreenDialogTitle = ({ t, showPill }: { t?: Transaction; showPill?: boolean }) => {
  if (!t) return null

  const pillType =
    Object.values(t.approvals).filter(Boolean).length === Object.values(t.approvals).length
      ? PillType.Executed
      : PillType.Pending
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        gap: 12px;

        > h2 {
          font-weight: bold;
          color: var(--color-foreground);
        }
      `}
    >
      <h2>Transaction Summary</h2>
      {showPill && (
        <Pill type={pillType}>
          <p css={{ fontSize: '12px', marginTop: '3px' }}>{pillType === PillType.Executed ? 'Executed' : 'Pending'}</p>
        </Pill>
      )}
    </div>
  )
}

export type FullScreenDialogContentsProps = {
  t?: Transaction
  cancelButtonTextOverride?: string
  readyToExecute?: boolean
  canCancel: boolean
  fee: Balance | undefined
  onCancel: () => Promise<void>
  onApprove: () => Promise<void>
  transactionDetails: React.ReactNode
}

export const FullScreenDialogContents = ({
  t,
  cancelButtonTextOverride,
  canCancel,
  readyToExecute,
  fee,
  onCancel,
  onApprove,
  transactionDetails,
}: FullScreenDialogContentsProps) => {
  const [cancelInFlight, setCancelInFlight] = useState(false)
  const [approveInFlight, setApproveInFlight] = useState(false)
  const extensionAccounts = useRecoilValue(accountsState)
  const feeTokenPrice = useRecoilValueLoadable(tokenPriceState(fee?.token))
  const defaultChain = filteredSupportedChains[0] as Chain
  const multisigDepositTotal = useRecoilValueLoadable(
    multisigDepositTotalSelector({
      chain_id: t?.multisig.chain.squidIds.chainData || defaultChain.squidIds.chainData,
      signatories: t?.approvals ? Object.keys(t.approvals).length : 0,
    })
  )
  const { transactions: pendingTransactions, loading: pendingLoading } = usePendingTransactions()
  const firstApproval = useMemo(() => {
    if (!t) return null
    return !Object.values(t.approvals).find(v => v === true)
  }, [t])

  // Check if the user has an account connected which can approve the transaction
  const connectedAccountCanApprove: boolean = useMemo(() => {
    if (!t) return false

    return Object.entries(t.approvals).some(([encodedAddress, signed]) => {
      if (signed) return false
      return extensionAccounts.some(account => account.address.toPubKey() === encodedAddress)
    })
  }, [t, extensionAccounts])

  const reserveComponent = useMemo(() => {
    if (!connectedAccountCanApprove) return null
    if (multisigDepositTotal.state === 'loading' || !fee) {
      return <Skeleton.Surface css={{ width: '32px', height: '16px' }} />
    } else if (multisigDepositTotal.state === 'hasValue') {
      return (
        <p>{`${balanceToFloat(multisigDepositTotal.contents)} ${fee?.token.symbol} (${formatUsd(
          balanceToFloat(multisigDepositTotal.contents) * feeTokenPrice.contents.current
        )})`}</p>
      )
    } else {
      return <p>Error reserve amount</p>
    }
  }, [multisigDepositTotal, fee, connectedAccountCanApprove, feeTokenPrice])

  const feeComponent = useMemo(() => {
    if (!connectedAccountCanApprove) return null
    if (feeTokenPrice.state === 'loading' || !fee) {
      return <Skeleton.Surface css={{ width: '32px', height: '16px' }} />
    } else if (feeTokenPrice.state === 'hasValue') {
      return (
        <p>{`${balanceToFloat(fee)} ${fee?.token.symbol} (${formatUsd(
          balanceToFloat(fee) * feeTokenPrice.contents.current
        )})`}</p>
      )
    } else {
      return <p>Error loading fee</p>
    }
  }, [feeTokenPrice, fee, connectedAccountCanApprove])

  if (!t) return null

  return (
    <div
      className={css`
        display: grid;
        align-items: start;
        height: calc(100% - 40px * 3);
        width: 100%;
      `}
    >
      <div
        className={css`
          display: grid;
          align-content: start;
          gap: 32px;
          padding: 0 42px 24px 42px;
          height: 100%;
          width: 100%;
          overflow-y: auto;
        `}
      >
        <TransactionSummaryRow t={t} shortDate={false} />
        <div css={{ display: 'grid', gap: '32px', alignItems: 'start' }}>
          <div css={{ display: 'grid', gap: '13px' }}>
            <h3>Details</h3>
            {transactionDetails}
          </div>
          {!t.executedAt ? (
            <div css={{ display: 'grid', gap: '13px' }}>
              <h3>Approvals</h3>
              <Approvals t={t} />
            </div>
          ) : null}
        </div>
      </div>
      {!t.executedAt ? (
        <div
          className={css`
            display: grid;
            margin-top: auto;
            border-top: 1px solid var(--color-backgroundLighter);
            gap: 16px;
            padding: 32px;
          `}
        >
          <div css={{ display: 'flex', justifyContent: 'space-between' }}>
            {readyToExecute && !t.callData ? (
              'Cannot execute transaction without calldata'
            ) : !connectedAccountCanApprove ? (
              'All connected extension accounts have already signed this transaction'
            ) : t.decoded?.type === TransactionType.ChangeConfig && pendingTransactions.length > 1 ? (
              `You must execute or cancel all pending transactions (${
                pendingTransactions.length - 1
              } remaining) before changing the signer configuration`
            ) : (
              <div css={{ width: '100%' }}>
                <div css={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <p>Estimated Fee</p>
                  {feeComponent}
                </div>
                {firstApproval && (
                  <div css={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <p>Reserve Amount</p>
                    {reserveComponent}
                  </div>
                )}
              </div>
            )}
          </div>
          <div css={{ display: 'grid', height: '56px', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
            <Button
              variant="outlined"
              onClick={() => {
                setCancelInFlight(true)
                onCancel().finally(() => {
                  setCancelInFlight(false)
                })
              }}
              disabled={approveInFlight || cancelInFlight || !canCancel}
            >
              {cancelInFlight ? (
                <div css={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  Signing and sending cancelation...
                  <CircularProgressIndicator />
                </div>
              ) : !canCancel ? (
                'Only originator can cancel'
              ) : (
                cancelButtonTextOverride || 'Reject'
              )}
            </Button>
            <Button
              onClick={() => {
                setApproveInFlight(true)
                onApprove().finally(() => {
                  setApproveInFlight(false)
                })
              }}
              disabled={
                pendingLoading ||
                approveInFlight ||
                cancelInFlight ||
                !connectedAccountCanApprove ||
                !fee ||
                (readyToExecute && !t.callData) ||
                (t.decoded?.type === TransactionType.ChangeConfig && pendingTransactions.length > 1)
              }
            >
              {approveInFlight ? (
                <div css={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  Signing and sending approval...
                  <CircularProgressIndicator />
                </div>
              ) : readyToExecute ? (
                'Approve & Execute'
              ) : (
                'Approve'
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
