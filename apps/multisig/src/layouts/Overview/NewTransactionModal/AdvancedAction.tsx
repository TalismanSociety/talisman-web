import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { CallDataPasteForm } from '@components/CallDataPasteForm'
import { useApproveAsMulti } from '@domains/chains'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { css } from '@emotion/css'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Button, FullScreenDialog } from '@talismn/ui'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { mockTransactions } from '../mocks'
import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { NameTransaction } from './generic-steps'

enum Step {
  Name,
  Details,
  Review,
}

const DetailsForm = (props: {
  extrinsic: SubmittableExtrinsic<'promise'> | undefined
  setExtrinsic: (s: SubmittableExtrinsic<'promise'> | undefined) => void
  onBack: () => void
  onNext: () => void
}) => {
  return (
    <div
      className={css`
        max-width: 623px;
        display: grid;
        justify-items: center;
        text-align: center;
      `}
    >
      <h1 css={{ marginBottom: '32px' }}>Transaction details</h1>
      <div css={{ marginBottom: '24px' }}>
        Create your extrinsic using Polkadot.js or any other app, and simply paste the calldata below to execute your
        transaction.
      </div>
      <CallDataPasteForm extrinsic={props.extrinsic} setExtrinsic={props.setExtrinsic} />
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 100%;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button disabled={props.extrinsic === undefined} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

const AdvancedAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const multisig = useRecoilValue(selectedMultisigState)
  const navigate = useNavigate()

  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()
  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic) {
      return {
        date: new Date(),
        hash: hash || '0x',
        description: name,
        chain: multisig.chain,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.encode()] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.Advanced,
          recipients: [],
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [multisig, name, extrinsic, hash])
  const signer = useNextTransactionSigner(t?.approvals)
  const { approveAsMulti, estimatedFee, ready: approveAsMultiReady } = useApproveAsMulti(signer?.address, hash, null)

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        padding: 32px;
        height: 100%;
      `}
    >
      {step === Step.Name ? (
        <NameTransaction
          name={name}
          setName={setName}
          onCancel={props.onCancel}
          onNext={() => {
            setStep(Step.Details)
          }}
        />
      ) : step === Step.Details || step === Step.Review ? (
        <DetailsForm
          onBack={() => setStep(Step.Name)}
          onNext={() => setStep(Step.Review)}
          extrinsic={extrinsic}
          setExtrinsic={setExtrinsic}
        />
      ) : null}
      <FullScreenDialog
        onRequestDismiss={() => {
          setStep(Step.Details)
        }}
        onClose={() => {
          setStep(Step.Details)
        }}
        title={<FullScreenDialogTitle t={mockTransactions[1] as Transaction} />}
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
        open={step === Step.Review}
      >
        <FullScreenDialogContents
          canCancel={true}
          cancelButtonTextOverride="Back"
          fee={approveAsMultiReady ? estimatedFee : undefined}
          t={t}
          onApprove={() =>
            new Promise((resolve, reject) => {
              if (!hash || !extrinsic) {
                toast.error("Couldn't get hash or extrinsic")
                return
              }
              approveAsMulti({
                metadata: {
                  description: name,
                  callData: extrinsic.method.toHex(),
                },
                onSuccess: () => {
                  navigate('/overview')
                  toast.success(
                    "Transaction sent! It will appear in your 'Pending' transactions as soon as it lands in a finalized block.",
                    { duration: 5000, position: 'bottom-right' }
                  )
                  if (!hash || !extrinsic) {
                    console.error("Couldn't get hash or extrinsic")
                    return
                  }
                  resolve()
                },
                onFailure: e => {
                  toast.error('Transaction failed')
                  console.error(e)
                  reject()
                },
              })
            })
          }
          onCancel={() => {
            setStep(Step.Details)
            return Promise.resolve()
          }}
        />
      </FullScreenDialog>
    </div>
  )
}

export default AdvancedAction
