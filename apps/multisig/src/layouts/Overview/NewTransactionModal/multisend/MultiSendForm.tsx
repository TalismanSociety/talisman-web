import { useEffect, useState } from 'react'
import { Loadable } from 'recoil'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import TokensSelect from '@components/TokensSelect'
import { BaseToken } from '@domains/chains'
import { MultiSendSend } from './multisend.types'
import MultiLineTransferInput from './MultiLineTransferInput'
import { isEqual } from 'lodash'

const MultiSendForm = (props: {
  tokens: Loadable<BaseToken[]>
  sends: MultiSendSend[]
  setSends: (s: MultiSendSend[]) => void
  onBack: () => void
  onNext: () => void
}) => {
  const [selectedToken, setSelectedToken] = useState<BaseToken | undefined>()
  const [invalidRows, setInvalidRows] = useState<number[]>([])

  useEffect(() => {
    if (!selectedToken && props.tokens.state === 'hasValue' && props.tokens.contents.length > 0) {
      setSelectedToken(props.tokens.contents[0])
    }
  }, [props.tokens, selectedToken])

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 32px;
        max-width: 623px;
        padding-top: 40px;
        width: 100%;
      `}
    >
      <TokensSelect
        tokens={props.tokens.contents ?? []}
        selectedToken={selectedToken}
        onChange={token => setSelectedToken(token)}
      />

      <MultiLineTransferInput
        sends={props.sends}
        token={selectedToken}
        onChange={(sends, invalid) => {
          // prevent unnecessary re-render if sends are the same
          if (!isEqual(sends, props.sends)) props.setSends(sends)
          setInvalidRows(invalid)
        }}
      />
      <div
        className={css`
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          button {
            height: 56px;
          }
        `}
      >
        <Button onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
        <Button
          disabled={props.sends.length === 0 || invalidRows.length > 0}
          onClick={props.onNext}
          children={<h3>Next</h3>}
        />
      </div>
    </div>
  )
}

export default MultiSendForm
