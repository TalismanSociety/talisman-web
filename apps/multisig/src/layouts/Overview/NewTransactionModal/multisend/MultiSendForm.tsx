import { useEffect, useState } from 'react'
import { Loadable } from 'recoil'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import TokensSelect from '@components/TokensSelect'
import { BaseToken } from '@domains/chains'
import { MultiSendSend } from './multisend.types'
import MultiLineTransferInput from './MultiLineSendInput'
import { isEqual } from 'lodash'
import AmountRow from '@components/AmountRow'
import BN from 'bn.js'
import { AlertCircle } from '@talismn/icons'

const MultiSendForm = (props: {
  tokens: Loadable<BaseToken[]>
  sends: MultiSendSend[]
  setSends: (s: MultiSendSend[]) => void
  onBack: () => void
  onNext: () => void
  canSend?: boolean
}) => {
  const [selectedToken, setSelectedToken] = useState<BaseToken | undefined>()
  const [hasInvalidRow, setHasInvalidRow] = useState(false)

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
        gap: 24px;
        max-width: 620px;
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
        token={selectedToken}
        onChange={(sends, invalidRows) => {
          // prevent unnecessary re-render if sends are the same
          if (!isEqual(sends, props.sends)) props.setSends(sends)
          setHasInvalidRow(invalidRows.length > 0)
        }}
      />
      <div
        css={{
          'display': 'flex',
          'flexDirection': 'column',
          '> div': {
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            p: { fontSize: 16 },
          },
        }}
      >
        {props.sends.length > 0 && selectedToken && !hasInvalidRow && (
          <>
            <div>
              <p>Total Sends</p>
              <p>{props.sends.length}</p>
            </div>
            <div>
              <p>Total Amount</p>
              <AmountRow
                hideIcon
                balance={{
                  token: selectedToken,
                  amount: props.sends.reduce((acc, send) => acc.add(send.amountBn), new BN(0)),
                }}
              />
            </div>
          </>
        )}

        <div css={{ width: '100%', marginTop: 8 }}>
          <div
            className={css`
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              width: 100%;
              button {
                height: 56px;
              }
            `}
          >
            <Button css={{ width: '100%' }} onClick={props.onBack} children={<h3>Back</h3>} variant="outlined" />
            <Button
              css={{ width: '100%' }}
              disabled={props.sends.length === 0 || hasInvalidRow || !props.canSend}
              onClick={props.onNext}
              children={<h3>Next</h3>}
            />
          </div>
        </div>
        {props.canSend === false && (
          <div
            css={({ color }) => ({
              display: 'flex',
              gap: 12,
              backgroundColor: color.surface,
              marginTop: 24,
              color: color.lightGrey,
              padding: 16,
              borderRadius: 12,
              width: '100%',
              p: { fontSize: 14 },
            })}
          >
            <AlertCircle size={32} />
            <p>
              Your Vault does not have the proxy permission required to send token on behalf of the proxied account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSendForm
