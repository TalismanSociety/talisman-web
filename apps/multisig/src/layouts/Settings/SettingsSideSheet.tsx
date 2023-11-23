import { SideSheet } from '@talismn/ui'
import { FullScreenDialogContents, FullScreenDialogTitle } from '../Overview/Transactions/FullScreenSummary'
import { Address } from '../../util/addresses'
import { Multisig, Transaction, TransactionApprovals, TransactionType } from '../../domains/multisig'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { selectedAccountState } from '../../domains/auth'
import { useApproveAsMulti } from '../../domains/chains'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import TransactionDetailsExpandable from '../Overview/Transactions/TransactionDetailsExpandable'

type Props = {
  open: boolean
  onClose: () => void

  extrinsic: SubmittableExtrinsic<'promise'> | undefined
  multisig: Multisig
  members: Address[]
  threshold: number
}
export const SettingsSideSheet: React.FC<Props> = ({ extrinsic, open, onClose, members, multisig, threshold }) => {
  const navigate = useNavigate()
  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()

  const signedInUser = useRecoilValue(selectedAccountState)

  const {
    approveAsMulti,
    estimatedFee,
    ready: approveAsMultiReady,
  } = useApproveAsMulti(signedInUser?.injected.address, hash, null, multisig)

  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic) {
      const hash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
      return {
        date: new Date(),
        hash,
        description: 'Change Signer Configuration',
        multisig: multisig,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.toPubKey()] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.ChangeConfig,
          recipients: [],
          changeConfigDetails: {
            signers: members,
            threshold,
          },
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [extrinsic, multisig, members, threshold])

  return (
    <SideSheet
      onRequestDismiss={onClose}
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
      open={open}
    >
      <FullScreenDialogContents
        t={t}
        fee={approveAsMultiReady ? estimatedFee : undefined}
        canCancel={true}
        cancelButtonTextOverride="Back"
        onApprove={() =>
          new Promise((resolve, reject) => {
            if (!hash || !extrinsic || !t) {
              toast.error("Couldn't get hash or extrinsic or tx")
              return
            }
            approveAsMulti({
              metadata: {
                description: t.description,
                callData: extrinsic.method.toHex(),
                changeConfigDetails: {
                  newMembers: members,
                  newThreshold: threshold,
                },
              },
              onSuccess: () => {
                navigate('/overview')
                toast.success('Approved.', { duration: 5000, position: 'bottom-right' })
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
          onClose()
          return Promise.resolve()
        }}
        transactionDetails={t ? <TransactionDetailsExpandable t={t} /> : null}
      />
    </SideSheet>
  )
}
