import AddressPill from '@components/AddressPill'
import { Token, useApproveAsMulti } from '@domains/chains'
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
import { Plus, Send, Trash } from '@talismn/icons'
import { Button, FullScreenDialog, Select, TextInput } from '@talismn/ui'
import { Address } from '@util/addresses'
import BN from 'bn.js'
import Decimal from 'decimal.js'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Loadable, useRecoilValue, useRecoilValueLoadable } from 'recoil'

import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { NameTransaction } from './generic-steps'

enum Step {
  Name,
  Details,
  Review,
}

interface MultiSendSend {
  token: Token
  address: Address
  amount: string
}

const DetailsForm = (props: {
  tokens: Loadable<Token[]>
  sends: MultiSendSend[]
  setSends: (s: MultiSendSend[]) => void
  onBack: () => void
  onNext: () => void
}) => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const [amount, setAmount] = useState('')
  const [destinationInput, setDestinationInput] = useState('')
  const [selectedToken, setSelectedToken] = useState<Token | undefined>()

  useEffect(() => {
    if (!selectedToken && props.tokens.state === 'hasValue' && props.tokens.contents.length > 0) {
      setSelectedToken(props.tokens.contents[0])
    }
  }, [props.tokens, selectedToken])

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gap: '18px',
          borderBottom: props.sends.length > 0 ? '1px solid var(--color-backgroundLight)' : '0',
          padding: props.sends.length > 0 ? '40px 0' : '0',
          maxHeight: '200px',
          overflow: 'scroll',
        }}
      >
        {props.sends.map((send, index) => {
          return (
            <div css={{ display: 'flex', gap: '8px' }} key={JSON.stringify({ send, index })}>
              <p>Send</p>
              <Send size={18} css={{ marginTop: '2px' }} />
              <AddressPill address={send.address} chain={selectedMultisig.chain} />
              <div css={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                <p>{send.amount}</p>
                <img src={send.token.logo} alt={send.token.symbol} css={{ height: '18px' }} />
                <p>{send.token.symbol}</p>
                <Trash
                  css={{ cursor: 'pointer' }}
                  onClick={() => {
                    props.setSends(props.sends.filter((_, i) => i !== index))
                  }}
                  size={18}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div
        className={css`
          margin-top: 32px;
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
              placeholder={`0 ${selectedToken?.symbol}`}
              leadingLabel={'Amount to send'}
              value={amount}
              onChange={event => {
                if (!selectedToken) return

                // Create a dynamic regular expression.
                // This regex will:
                // - Match any string of up to `digits` count of digits, optionally separated by a decimal point.
                // - The total count of digits, either side of the decimal point, can't exceed `digits`.
                // - It will also match an empty string, making it a valid input.
                const digits = selectedToken.decimals
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
                  setAmount(event.target.value)
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
            <Select placeholder="Select token" value={selectedToken?.id} {...props}>
              {props.tokens.state === 'hasValue'
                ? props.tokens.contents.map(t => {
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
                  })
                : []}
            </Select>
          </div>
        </div>
      </div>
      <div
        className={css`
          margin-top: 32px;
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
          value={destinationInput}
          onChange={event => {
            setDestinationInput(event.target.value)
          }}
        />
      </div>
      <div
        className={css`
          display: grid;
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 38px;
          width: 490px;
          button {
            height: 56px;
          }
        `}
      >
        <Button
          variant="secondary"
          css={{
            gridColumn: '1 / 3',
            width: 'auto',
            height: '40px !important',
            marginBottom: '16px',
            borderRadius: '24px',
            justifySelf: 'center',
            backgroundColor: 'var(--color-backgroundLight)',
            color: 'var(--color-offWhite)',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            const address = Address.fromSs58(destinationInput)
            if (!selectedToken || !address) return
            props.setSends([...props.sends, { address, amount, token: selectedToken }])
            setAmount('')
            setDestinationInput('')
          }}
          disabled={
            Address.fromSs58(destinationInput) === false ||
            isNaN(parseFloat(amount)) ||
            amount.endsWith('.') ||
            !selectedToken
          }
          children={
            <div
              className={css`
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 5px;
                svg {
                  color: var(--color-primary);
                }
              `}
            >
              <div>
                <Plus />
              </div>
              <h3>{`Add${props.sends.length > 0 ? ' another' : ''}`}</h3>
            </div>
          }
        />
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
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(multisig.chain.rpc))
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
          if (!apiLoadable.contents.tx.balances?.transferKeepAlive) throw Error('missing balances.transferKeepAlive')
          const amountBn = toBn(send.amount, send.token.decimals)
          return apiLoadable.contents.tx.balances.transferKeepAlive(send.address.bytes, amountBn)
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
        approvals: multisig.signers.reduce((acc, key) => {
          acc[key.encode()] = false
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
      </FullScreenDialog>
    </div>
  )
}

export default MultiSendAction
