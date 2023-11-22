import { buildTransferExtrinsic, useApproveAsMulti } from '@domains/chains'

import { pjsApiSelector } from '@domains/chains/pjs-api'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigChainTokensState,
  useNextTransactionSigner,
  useSelectedMultisig,
} from '@domains/multisig'
import { hasPermission } from '@domains/proxy/util'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { SideSheet } from '@talismn/ui'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../../Overview/Transactions/FullScreenSummary'

import { MultiSendSend } from './multisend.types'
import MultiSendForm from './MultiSendForm'
import { Layout } from '../../Layout'
import { NewTransactionHeader } from '../NewTransactionHeader'
import { Share2 } from '@talismn/icons'
import TransactionDetailsExpandable from '../../Overview/Transactions/TransactionDetailsExpandable'

enum Step {
  Details,
  Review,
}

const MultiSend = () => {
  const [step, setStep] = useState(Step.Details)
  const [name, setName] = useState('')
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const [sends, setSends] = useState<MultiSendSend[]>([])
  const [multisig] = useSelectedMultisig()
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const navigate = useNavigate()

  const permissions = hasPermission(multisig, 'transfer')

  useEffect(() => {
    if (sends.length > 0 && apiLoadable.state === 'hasValue') {
      if (
        !apiLoadable.contents.tx.balances?.transferKeepAlive ||
        !apiLoadable.contents.tx.proxy?.proxy ||
        !apiLoadable.contents.tx.utility?.batchAll
      ) {
        throw Error('chain missing required pallet/s for multisend')
      }
      try {
        const sendExtrinsics = sends.map(send => {
          const balance = {
            amount: send.amountBn,
            token: send.token,
          }
          return buildTransferExtrinsic(apiLoadable.contents, send.address, balance)
        })

        const batchAllExtrinsic = apiLoadable.contents.tx.utility.batchAll(sendExtrinsics)
        const extrinsic = apiLoadable.contents.tx.proxy.proxy(multisig.proxyAddress.bytes, null, batchAllExtrinsic)
        setExtrinsic(extrinsic)
      } catch (error) {
        console.error(error)
      }
    }
  }, [sends, apiLoadable, multisig.proxyAddress])

  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic) {
      const hash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
      return {
        date: new Date(),
        hash,
        description: name,
        chain: multisig.chain,
        multisig,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.toPubKey()] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.MultiSend,
          // recipients: [{ address: destination, balance: { amount: amountBn || new BN(0), token: selectedToken } }],
          recipients: sends.map(send => ({
            address: send.address,
            balance: { amount: send.amountBn, token: send.token },
          })),
          yaml: '',
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [extrinsic, multisig, sends, name])
  const signer = useNextTransactionSigner(t?.approvals)
  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()
  const {
    approveAsMulti,
    estimatedFee,
    ready: approveAsMultiReady,
  } = useApproveAsMulti(signer?.address, hash, null, t?.multisig)

  return (
    <Layout selected="Multi-send" requiresMultisig>
      <div css={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '32px 8%' }}>
        <div css={{ width: '100%', maxWidth: 620 }}>
          <NewTransactionHeader icon={<Share2 />}>Multi-send</NewTransactionHeader>
          <MultiSendForm
            {...permissions}
            name={name}
            setName={setName}
            tokens={tokens}
            onNext={() => setStep(Step.Review)}
            sends={sends}
            setSends={setSends}
          />
        </div>
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
            t={t}
            fee={approveAsMultiReady ? estimatedFee : undefined}
            canCancel={true}
            cancelButtonTextOverride="Back"
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
                    toast.success('Transaction successful!', { duration: 5000, position: 'bottom-right' })
                    resolve()
                  },
                  onFailure: e => {
                    navigate('/overview')
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
            transactionDetails={t ? <TransactionDetailsExpandable t={t} /> : null}
          />
        </SideSheet>
      </div>
    </Layout>
  )
}

export default MultiSend
