import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { useApproveAsMulti } from '@domains/chains'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { SideSheet } from '@talismn/ui'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../../Overview/Transactions/FullScreenSummary'
import { DetailsForm } from './DetailsForm'
import { Layout } from '../../Layout'
import TransactionDetailsExpandable from '../../Overview/Transactions/TransactionDetailsExpandable'

enum Step {
  Details,
  Review,
}

const AdvancedAction = () => {
  const [step, setStep] = useState(Step.Details)
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
        multisig,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.toPubKey()] = false
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
  const {
    approveAsMulti,
    estimatedFee,
    ready: approveAsMultiReady,
  } = useApproveAsMulti(signer?.address, hash, null, multisig)

  return (
    <Layout selected="Advanced" requiresMultisig>
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '32px 8%' }}>
        {step === Step.Details || step === Step.Review ? (
          <DetailsForm
            name={name}
            setName={setName}
            onNext={() => setStep(Step.Review)}
            extrinsic={extrinsic}
            setExtrinsic={setExtrinsic}
          />
        ) : null}
        <SideSheet
          onRequestDismiss={() => {
            setStep(Step.Details)
          }}
          onClose={() => {
            setStep(Step.Details)
          }}
          title={<FullScreenDialogTitle t={t} />}
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
            transactionDetails={t ? <TransactionDetailsExpandable t={t} /> : null}
            onCancel={() => {
              setStep(Step.Details)
              return Promise.resolve()
            }}
          />
        </SideSheet>
      </div>
    </Layout>
  )
}

export default AdvancedAction
