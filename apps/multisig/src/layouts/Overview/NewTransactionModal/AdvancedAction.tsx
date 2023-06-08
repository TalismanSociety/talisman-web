import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-yaml'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { Chain, supportedChains } from '@domains/chains'
import { css } from '@emotion/css'
import { Button, FullScreenDialog } from '@talismn/ui'
import { debounce } from 'lodash'
import { useState } from 'react'
import AceEditor from 'react-ace'
import { useNavigate } from 'react-router-dom'

import { mockTransactions } from '../mocks'
import { Transaction__deprecated } from '../Transactions'
import { FullScreenDialogContents, FullScreenDialogTitle } from '../Transactions/FullScreenSummary'
import { ChooseChain, NameTransaction } from './generic-steps'

enum Step {
  Name,
  Chain,
  Details,
  Review,
}

const dummyDecodedCall = `PalletCall:
  pallet: 'pallet_example'
  function: 'fake_function'
  params:
    - param1:
        type: 'u64'
        value: '10'
    - param2:
        type: 'AccountId'
        value: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    - param3:
        type: 'Option<Bytes>'
        value: 'None'
`

// TODO
const decodeCalldata = (s: string): string | false => {
  return dummyDecodedCall
}

const DetailsForm = (props: {
  calldata: string
  setCalldata: (s: string) => void
  onBack: () => void
  onNext: () => void
}) => {
  const [decoded, setDecoded] = useState<string | boolean>(false)

  // Debounce decoding
  const debouncedDecode = debounce(nextValue => {
    console.log('hello')
    const decoded = decodeCalldata(nextValue)
    if (decoded !== false) {
      setDecoded(decoded)
    }
  }, 1000)

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
      <div>
        Create your extrinsic using Polkadot.js or any other app, and simply paste the calldata here to execute your
        transaction.
      </div>
      <AceEditor
        mode="yaml"
        theme="twilight"
        value={decoded !== false ? (decoded as string) : props.calldata}
        readOnly={decoded !== false}
        onChange={s => {
          // Don't allow it to change once it's been decoded
          if (decoded !== false) return
          debouncedDecode(s)
          props.setCalldata(s)
        }}
        name="calldata-editor"
        setOptions={{ useWorker: false }}
        style={{ width: '100%', height: '230px', marginTop: '24px', border: '1px solid #232323' }}
        showGutter={!!decoded}
      />
      {decoded && (
        <span
          onClick={() => {
            setDecoded(false)
            props.setCalldata('')
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
        <Button disabled={decoded === false} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

const AdvancedAction = (props: { onCancel: () => void }) => {
  const [step, setStep] = useState(Step.Name)
  const [name, setName] = useState('')
  const [calldata, setCalldata] = useState('')
  const [chain, setChain] = useState<Chain>(supportedChains[0] as Chain)
  const navigate = useNavigate()

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
            setStep(Step.Chain)
          }}
        />
      ) : step === Step.Chain ? (
        <ChooseChain
          chain={chain}
          setChain={setChain}
          chains={supportedChains}
          onBack={() => setStep(Step.Name)}
          onNext={() => setStep(Step.Details)}
        />
      ) : step === Step.Details || step === Step.Review ? (
        <DetailsForm
          onBack={() => setStep(Step.Chain)}
          onNext={() => setStep(Step.Review)}
          calldata={calldata}
          setCalldata={setCalldata}
        />
      ) : null}
      <FullScreenDialog
        onRequestDismiss={() => {
          setStep(Step.Details)
        }}
        onClose={() => {
          setStep(Step.Details)
        }}
        title={<FullScreenDialogTitle t={mockTransactions[1] as Transaction__deprecated} />}
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
          t={mockTransactions[1] as Transaction__deprecated}
          onApprove={() => {
            navigate('/overview')
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
