import { css } from '@emotion/css'
import { useMemo, useState } from 'react'
import {
  SplitAbstainVoteParams,
  StandardVoteParams,
  VoteDetails,
  defaultVoteDetails,
  isVoteDetailsComplete,
  isVoteFeatureSupported,
} from '@domains/referenda'
import VotingForm from './VotingForm'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigChainTokensState,
  selectedMultisigState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { SplitVoteParams } from '@domains/referenda'
import { useApproveAsMulti } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import TransactionSummarySideSheet from '../../Transactions/TransactionSummarySideSheet'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

type Props = {
  onCancel: () => void
}

const VoteAction: React.FC<Props> = ({ onCancel }) => {
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [reviewing, setReviewing] = useState(false)
  const navigate = useNavigate()
  const [voteDetails, setVoteDetails] = useState<VoteDetails>({
    details: { Standard: defaultVoteDetails.Standard },
  })

  // instead of allowing the user to select any token later on, we just use the first native token of the chain
  const nativeToken = tokens.contents?.[0]
  const isPalletSupported = apiLoadable.state === 'hasValue' ? isVoteFeatureSupported(apiLoadable.contents) : undefined

  const extrinsic = useMemo(() => {
    if (
      apiLoadable.state !== 'hasValue' ||
      !isPalletSupported ||
      voteDetails.referendumId === undefined ||
      !nativeToken ||
      !isVoteDetailsComplete(voteDetails)
    )
      return
    try {
      const voteExtrinsic = apiLoadable.contents.tx.convictionVoting.vote(
        voteDetails.referendumId,
        voteDetails.details as
          | { Standard: StandardVoteParams }
          | { Split: SplitVoteParams }
          | { SplitAbstain: SplitAbstainVoteParams }
      )
      return apiLoadable.contents.tx.proxy.proxy(multisig.proxyAddress.bytes, null, voteExtrinsic)
    } catch (e) {
      console.error(e)
    }
  }, [
    apiLoadable.contents.tx.convictionVoting,
    apiLoadable.contents.tx.proxy,
    apiLoadable.state,
    isPalletSupported,
    multisig.proxyAddress.bytes,
    nativeToken,
    voteDetails,
  ])

  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()
  const transactionName = useMemo(() => {
    const vote = voteDetails.details.Standard?.vote.aye ? 'Aye' : 'Nay'
    return `Vote ${vote} on Proposal #${voteDetails.referendumId}`
  }, [voteDetails])

  const t: Transaction | undefined = useMemo(() => {
    if (extrinsic && nativeToken && hash) {
      return {
        date: new Date(),
        hash,
        description: transactionName,
        chain: multisig.chain,
        multisig,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.toPubKey()] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.Vote,
          recipients: [],
          voteDetails: {
            ...voteDetails,
            token: nativeToken,
          },
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [extrinsic, nativeToken, hash, transactionName, multisig, voteDetails])

  const signer = useNextTransactionSigner(t?.approvals)
  const { approveAsMulti, estimatedFee, ready } = useApproveAsMulti(signer?.address, hash, null, t?.multisig)

  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        padding: 32px;
      `}
    >
      <VotingForm
        voteDetails={voteDetails}
        token={nativeToken}
        onChange={setVoteDetails}
        onCancel={onCancel}
        onNext={() => setReviewing(true)}
      />
      <TransactionSummarySideSheet
        open={reviewing && !!isPalletSupported}
        onClose={() => setReviewing(false)}
        t={t}
        canCancel
        fee={ready ? estimatedFee : undefined}
        cancelButtonTextOverride="Back"
        onApprove={() =>
          new Promise((resolve, reject) => {
            if (!extrinsic) {
              toast.error("Couldn't get hash or extrinsic")
              return
            }
            approveAsMulti({
              metadata: {
                description: transactionName,
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
          setReviewing(false)
          return Promise.resolve()
        }}
      />
    </div>
  )
}

export default VoteAction
