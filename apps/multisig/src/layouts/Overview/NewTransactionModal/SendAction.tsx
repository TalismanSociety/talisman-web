import { Token, useApproveAsMulti } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import {
  Transaction,
  TransactionApprovals,
  TransactionType,
  selectedMultisigChainTokensState,
  selectedMultisigState,
  txOffchainMetadataState,
  useNextTransactionSigner,
} from '@domains/multisig'
import { css } from '@emotion/css'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Button, FullScreenDialog, Select, TextInput } from '@talismn/ui'
import { toSs52Address } from '@util/addresses'
import BN from 'bn.js'
import Decimal from 'decimal.js'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { NameTransaction } from './generic-steps'

enum Step {
  Name,
  Details,
  Review,
}

const DetailsForm = (props: {
  destination: string
  amount: string
  selectedToken: Token | undefined
  tokens: Token[]
  setDestination: (d: string) => void
  setAmount: (a: string) => void
  onBack: () => void
  onNext: () => void
}) => {
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
        <div css={{ display: 'flex', width: '100%', gap: '12px' }}>
          <div
            className={css`
              display: 'flex';
              flex-grow: 1;
              align-items: center;
            `}
          >
            <TextInput
              className={css`
                font-size: 18px !important;
              `}
              placeholder={`0 ${props.selectedToken?.symbol}`}
              leadingLabel={'Amount to send'}
              value={props.amount}
              onChange={event => {
                if (!props.selectedToken) return

                // Create a dynamic regular expression.
                // This regex will:
                // - Match any string of up to `digits` count of digits, optionally separated by a decimal point.
                // - The total count of digits, either side of the decimal point, can't exceed `digits`.
                // - It will also match an empty string, making it a valid input.
                const digits = props.selectedToken.decimals
                let regex = new RegExp(
                  '^(?:(\\d{1,' +
                    digits +
                    '})|(\\d{0,' +
                    (digits - 1) +
                    '}\\.\\d{1,' +
                    (digits - 1) +
                    '})|(\\d{1,' +
                    (digits - 1) +
                    '}\\.\\d{0,' +
                    (digits - 1) +
                    '})|^$)$'
                )
                if (regex.test(event.target.value)) {
                  props.setAmount(event.target.value)
                }
              }}
            />
          </div>
          <div
            className={css`
              display: flex;
              height: 100%;
              align-items: center;
              justify-content: center;
              height: 95.5px;
              button {
                height: 51.5px;
                gap: 8px;
                div {
                  margin-top: 2px;
                }
                svg {
                  display: none;
                }
              }
            `}
          >
            <Select placeholder="Select token" value={props.selectedToken?.id} {...props}>
              {props.tokens.map(t => {
                return (
                  <Select.Item
                    key={t.id}
                    value={t.id}
                    leadingIcon={
                      <div
                        className={css`
                          width: 24px;
                          height: auto;
                        `}
                      >
                        <img src={t.logo} alt={t.symbol} />
                      </div>
                    }
                    headlineText={t.symbol}
                  />
                )
              })}
            </Select>
          </div>
        </div>
      </div>
      <div
        className={css`
          margin-top: 64px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          leadingLabel={'Recipient'}
          placeholder="14JVAWDg9h2iMqZgmiRpvZd8aeJ3TvANMCv6V5Te4N4Vkbg5"
          value={props.destination}
          onChange={event => {
            props.setDestination(event.target.value)
          }}
        />
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
            toSs52Address(props.destination) === false ||
            isNaN(parseFloat(props.amount)) ||
            props.amount.endsWith('.') ||
            !props.selectedToken
          }
          onClick={props.onNext}
          children={<h3>Next</h3>}
        />
      </div>
    </>
  )
}

const SendAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | undefined>()
  const tokens = useRecoilValueLoadable(selectedMultisigChainTokensState)
  const [selectedToken, setSelectedToken] = useState<Token | undefined>()
  const [amountInput, setAmountInput] = useState('')
  const multisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))
  const [metadataCache, setMetadataCache] = useRecoilState(txOffchainMetadataState)
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
    if (destination && selectedToken && apiLoadable.state === 'hasValue' && amountBn && toSs52Address(destination)) {
      if (!apiLoadable.contents.tx.balances?.transferKeepAlive || !apiLoadable.contents.tx.proxy?.proxy) {
        throw Error('chain missing balances pallet')
      }
      try {
        const innerExtrinsic = apiLoadable.contents.tx.balances.transferKeepAlive(destination, amountBn)
        const extrinsic = apiLoadable.contents.tx.proxy.proxy(multisig.proxyAddress, null, innerExtrinsic)
        setExtrinsic(extrinsic)
      } catch (error) {
        console.error(error)
      }
    }
  }, [destination, selectedToken, apiLoadable, amountBn, multisig.proxyAddress])

  const t: Transaction | undefined = useMemo(() => {
    if (selectedToken && extrinsic) {
      const hash = extrinsic.registry.hash(extrinsic.method.toU8a()).toHex()
      return {
        date: new Date(),
        hash,
        description: name,
        chainId: multisig.chain.id,
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key] = false
          return acc
        }, {} as TransactionApprovals),
        decoded: {
          type: TransactionType.Transfer,
          recipients: [{ address: destination, balance: { amount: amountBn || new BN(0), token: selectedToken } }],
          yaml: '',
        },
        callData: extrinsic.method.toHex(),
      }
    }
  }, [amountBn, destination, multisig, name, selectedToken, extrinsic])
  const signer = useNextTransactionSigner(t?.approvals)
  const hash = extrinsic?.registry.hash(extrinsic.method.toU8a()).toHex()
  const { approveAsMulti, estimatedFee } = useApproveAsMulti(signer?.address, hash, null)

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
          selectedToken={selectedToken}
          tokens={tokens.state === 'hasValue' ? tokens.contents : []}
          destination={destination}
          amount={amountInput}
          setDestination={setDestination}
          setAmount={setAmountInput}
        />
      ) : null}
      <FullScreenDialog
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
          fee={estimatedFee}
          canCancel={true}
          cancelButtonTextOverride="Back"
          onApprove={() =>
            new Promise((resolve, reject) => {
              approveAsMulti({
                onSuccess: () => {
                  navigate('/overview')
                  toast.success('Transaction successful!', { duration: 5000, position: 'bottom-right' })
                  resolve()
                  if (!hash || !extrinsic) {
                    console.error("Couldn't get hash or extrinsic")
                    return
                  }
                  setMetadataCache({
                    ...metadataCache,
                    [hash]: [{ callData: extrinsic.method.toHex(), description: name }, new Date()],
                  })
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

export default SendAction
