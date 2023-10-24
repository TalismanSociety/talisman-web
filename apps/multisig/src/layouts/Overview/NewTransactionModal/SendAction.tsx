import { AmountFlexibleInput } from '@components/AmountFlexibleInput'
import { BaseToken, buildTransferExtrinsic, useApproveAsMulti } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigChainTokensState,
  selectedMultisigState,
  useNextTransactionSigner,
  useSelectedMultisig,
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
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { NameTransaction } from '../../NewTransaction/NameTransaction'
import AddressInput from '@components/AddressInput'
import { useKnownAddresses } from '@hooks/useKnownAddresses'
import { hasPermission } from '@domains/proxy/util'
import { Alert } from '@components/Alert'

enum Step {
  Name,
  Details,
  Review,
}

const DetailsForm = (props: {
  destinationAddress?: Address
  amount: string
  selectedToken: BaseToken | undefined
  setSelectedToken: (t: BaseToken) => void
  tokens: BaseToken[]
  setDestinationAddress: (address?: Address) => void
  setAmount: (a: string) => void
  onBack: () => void
  onNext: () => void
}) => {
  const [multisig] = useSelectedMultisig()
  const { addresses } = useKnownAddresses(multisig.id)
  const { hasDelayedPermission, hasNonDelayedPermission } = hasPermission(multisig, 'transfer')

  return (
    <>
      <h1>Transaction details</h1>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <AmountFlexibleInput
          tokens={props.tokens}
          selectedToken={props.selectedToken}
          setSelectedToken={props.setSelectedToken}
          amount={props.amount}
          setAmount={props.setAmount}
        />
      </div>
      <div
        className={css`
          margin-top: 64px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <AddressInput onChange={props.setDestinationAddress} addresses={addresses} leadingLabel="Recipient" />
      </div>
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 48px;
          width: 490px;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button
          disabled={
            !hasNonDelayedPermission ||
            !props.destinationAddress ||
            isNaN(parseFloat(props.amount)) ||
            props.amount.endsWith('.') ||
            !props.selectedToken
          }
          onClick={props.onNext}
          children={<h3>Next</h3>}
        />
      </div>
      {hasNonDelayedPermission === false &&
        (hasDelayedPermission ? (
          <Alert>
            <p>Time delayed proxies are not supported yet.</p>
          </Alert>
        ) : (
          <Alert>
            <p>
              Your Vault does not have the proxy permission required to send token on behalf of the proxied account.
            </p>
          </Alert>
        ))}
    </>
  )
}

const SendAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const [destinationAddress, setDestinationAddress] = useState<Address | undefined>()
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [selectedToken, setSelectedToken] = useState<BaseToken | undefined>()
  const [amountInput, setAmountInput] = useState('')
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpcs))
  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedToken && tokens.state === 'hasValue' && tokens.contents.length > 0) {
      setSelectedToken(tokens.contents[0])
    }
  }, [tokens, selectedToken])

  const amountBn: BN | undefined = useMemo(() => {
    if (!selectedToken || isNaN(parseFloat(amountInput))) return

    let stringValueRounded = new Decimal(amountInput)
      .mul(Decimal.pow(10, selectedToken.decimals))
      .toDecimalPlaces(0) // to round it
      .toFixed() // convert it back to string
    return new BN(stringValueRounded)
  }, [amountInput, selectedToken])

  useEffect(() => {
    if (selectedToken && apiLoadable.state === 'hasValue' && amountBn && destinationAddress) {
      if (!apiLoadable.contents.tx.balances?.transferKeepAlive || !apiLoadable.contents.tx.proxy?.proxy) {
        throw Error('chain missing balances pallet')
      }
      try {
        const balance = {
          amount: amountBn,
          token: selectedToken,
        }
        const innerExtrinsic = buildTransferExtrinsic(apiLoadable.contents, destinationAddress, balance)
        const extrinsic = apiLoadable.contents.tx.proxy.proxy(multisig.proxyAddress.bytes, null, innerExtrinsic)
        setExtrinsic(extrinsic)
      } catch (error) {
        console.error(error)
      }
    }
  }, [destinationAddress, selectedToken, apiLoadable, amountBn, multisig])

  const t: Transaction | undefined = useMemo(() => {
    if (selectedToken && extrinsic && destinationAddress) {
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
          type: TransactionType.Transfer,
          recipients: [
            { address: destinationAddress, balance: { amount: amountBn || new BN(0), token: selectedToken } },
          ],
          yaml: '',
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [amountBn, destinationAddress, multisig, name, selectedToken, extrinsic])
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
        <DetailsForm
          onBack={() => setStep(Step.Name)}
          onNext={() => setStep(Step.Review)}
          selectedToken={selectedToken}
          tokens={tokens.state === 'hasValue' ? tokens.contents : []}
          destinationAddress={destinationAddress}
          amount={amountInput}
          setDestinationAddress={setDestinationAddress}
          setAmount={setAmountInput}
          setSelectedToken={setSelectedToken}
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

export default SendAction
