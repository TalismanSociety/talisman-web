import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { useApproveAsMulti, useDecodeCallData } from '@domains/chains'
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
import AceEditor from 'react-ace'
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
  const { loading, decodeCallData } = useDecodeCallData()

  return (
    <div
      onPaste={event => {
        // User must reset extrinsic before pasting new one
        if (props.extrinsic) return

        try {
          const extrinsic = decodeCallData(event.clipboardData.getData('text') as `0x{string}`)
          if (!extrinsic) throw Error('extrinsic should be loaded, did you try to set before loading was ready?')
          props.setExtrinsic(extrinsic)
        } catch (error) {
          if (error instanceof Error) toast.error(`Invalid calldata: ${error.message}`)
          else toast.error(`Invalid calldata: unknown error`)
        }
      }}
      className={css`
        max-width: 623px;
        display: grid;
        justify-items: center;
        text-align: center;
      `}
    >
      <h1 css={{ marginBottom: '32px' }}>Transaction details</h1>
      <div>
        Create your extrinsic using Polkadot.js or any other app, and simply paste the calldata here to execute your
        transaction.
      </div>
      <AceEditor
        mode="json"
        theme="twilight"
        placeholder="Paste hex-encoded calldata"
        value={
          loading ? 'Loading...' : props.extrinsic ? JSON.stringify(props.extrinsic.method.toHuman(), null, 2) : ''
        }
        readOnly={true}
        name="calldata-editor"
        setOptions={{ useWorker: false }}
        style={{ width: '100%', height: '230px', marginTop: '24px', border: '1px solid #232323' }}
        showGutter={!!props.extrinsic}
      />
      {props.extrinsic !== undefined && (
        <span
          onClick={() => {
            props.setExtrinsic(undefined)
          }}
          className={css`
            justify-self: start;
            margin-top: 8px;
            font-size: small;
            text-decoration: underline dotted;
            cursor: pointer;
          `}
        >
          Reset
        </span>
      )}
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
  const [extensionPopupOpen, setExtensionPopupOpen] = useState(false)
  const navigate = useNavigate()

  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic) {
      return {
        createdTimestamp: new Date(),
        executedTimestamp: undefined,
        hash: '',
        description: name,
        chainId: multisig.chain.id,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.Advanced,
          recipients: [],
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [multisig, name, extrinsic])
  const signer = useNextTransactionSigner(t?.approvals)
  const { approveAsMulti, estimatedFee } = useApproveAsMulti(signer?.address, extrinsic)

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
          fee={estimatedFee}
          t={t}
          loading={extensionPopupOpen}
          onApprove={() => {
            setExtensionPopupOpen(true)
            approveAsMulti(
              () => {
                navigate('/overview')
                toast.success(
                  "Transaction sent! It will appear in your 'Pending' transactions as soon as it lands in a finalized block.",
                  { duration: 5000, position: 'bottom-right' }
                )
              },
              () => {},
              e => {
                toast.error('Transaction failed')
                console.error(e)
                setExtensionPopupOpen(false)
              }
            )
          }}
          onReject={() => {
            setStep(Step.Details)
          }}
        />
      </FullScreenDialog>
    </div>
  )
}

export default AdvancedAction
