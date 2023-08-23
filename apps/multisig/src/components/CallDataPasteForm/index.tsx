import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-twilight'
import 'ace-builds/src-noconflict/ext-language_tools'

import { decodeCallData } from '@domains/chains'
import { pjsApiSelector } from '@domains/chains/pjs-api'
import { selectedMultisigState } from '@domains/multisig'
import { css } from '@emotion/css'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import AceEditor from 'react-ace'
import toast from 'react-hot-toast'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

export const CallDataPasteForm = (props: {
  extrinsic: SubmittableExtrinsic<'promise'> | undefined
  setExtrinsic: (s: SubmittableExtrinsic<'promise'> | undefined) => void
}) => {
  const selectedMultisig = useRecoilValue(selectedMultisigState)
  const apiLoadable = useRecoilValueLoadable(pjsApiSelector(selectedMultisig.chain.rpcs))
  const loading = apiLoadable.state === 'loading'

  return (
    <div
      css={{ width: '100%', display: 'grid' }}
      onPaste={event => {
        // User must reset extrinsic before pasting new one
        if (props.extrinsic) return

        try {
          const extrinsic = decodeCallData(apiLoadable.contents, event.clipboardData.getData('text') as `0x{string}`)
          if (!extrinsic) throw Error('extrinsic should be loaded, did you try to set before loading was ready?')
          props.setExtrinsic(extrinsic)
        } catch (error) {
          if (error instanceof Error) toast.error(`Invalid calldata: ${error.message}`)
          else toast.error(`Invalid calldata: unknown error`)
        }
      }}
    >
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
        style={{ width: '100%', height: '230px', border: '1px solid #232323' }}
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
    </div>
  )
}
