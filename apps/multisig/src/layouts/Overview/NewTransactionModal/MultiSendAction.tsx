import { BaseToken, buildTransferExtrinsic, useApproveAsMulti } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigChainTokensState,
  selectedMultisigState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { css } from '@emotion/css'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Button, SideSheet } from '@talismn/ui'
import { Address } from '@util/addresses'
import BN from 'bn.js'
import Decimal from 'decimal.js'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Loadable, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { NameTransaction } from './generic-steps'
import TokensSelect from '../../../components/TokensSelect'

enum Step {
  Name,
  Details,
  Review,
}

interface MultiSendSend {
  token: BaseToken
  address: Address
  amount: string
}

const DetailsForm = (props: {
  tokens: Loadable<BaseToken[]>
  sends: MultiSendSend[]
  setSends: (s: MultiSendSend[]) => void
  onBack: () => void
  onNext: () => void
}) => {
  const [selectedToken, setSelectedToken] = useState<BaseToken | undefined>()

  useEffect(() => {
    if (!selectedToken && props.tokens.state === 'hasValue' && props.tokens.contents.length > 0) {
      setSelectedToken(props.tokens.contents[0])
    }
  }, [props.tokens, selectedToken])

  return (
    <div
      className={css`
        max-width: 490px;
        padding-top: 40px;
        width: 100%;
      `}
    >
      <TokensSelect
        tokens={props.tokens.contents ?? []}
        selectedToken={selectedToken}
        onChange={token => setSelectedToken(token)}
      />
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 38px;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button disabled={props.sends.length === 0} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

const toBn = (amount: string, decimals: number) => {
  let stringValueRounded = new Decimal(amount)
    .mul(Decimal.pow(10, decimals))
    .toDecimalPlaces(0) // to round it
    .toFixed() // convert it back to string
  return new BN(stringValueRounded)
}

const MultiSendAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const [sends, setSends] = useState<MultiSendSend[]>([])
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const navigate = useNavigate()

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
          const amountBn = toBn(send.amount, send.token.decimals)
          const balance = {
            amount: amountBn,
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
            balance: { amount: toBn(send.amount, send.token.decimals), token: send.token },
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
    <div
      className={css`
        display: grid;
        justify-items: center;
        margin-top: 18px;
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
        <>
          <h1>{name}</h1>
          <DetailsForm
            tokens={tokens}
            onBack={() => setStep(Step.Name)}
            onNext={() => setStep(Step.Review)}
            sends={sends}
            setSends={setSends}
          />
        </>
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
        />
      </SideSheet>
    </div>
  )
}

export default MultiSendAction
