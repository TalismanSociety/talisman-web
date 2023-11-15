import { useEffect, useState } from 'react'
import { Loadable } from 'recoil'
import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'
import TokensSelect from '@components/TokensSelect'
import { BaseToken } from '@domains/chains'
import { MultiSendSend } from './multisend.types'
import { isEqual } from 'lodash'
import AmountRow from '@components/AmountRow'
import BN from 'bn.js'
import { Alert } from '@components/Alert'
import { MultiLineSendInput } from './MultiLineSendInput'

const MultiSendForm = (props: {
  name: string
  tokens: Loadable<BaseToken[]>
  sends: MultiSendSend[]
  setName: (n: string) => void
  setSends: (s: MultiSendSend[]) => void
  onNext: () => void
  hasNonDelayedPermission?: boolean
  hasDelayedPermission?: boolean
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
        padding-top: 32px;
        width: 100%;
      `}
    >
      <TextInput
        leadingLabel="Transaction Description"
        css={{ fontSize: '18px !important' }}
        placeholder={`e.g. "Contract Payments June 2023"`}
        value={props.name}
        onChange={e => props.setName(e.target.value)}
      />
      <TokensSelect
        leadingLabel="Token"
        tokens={props.tokens.contents ?? []}
        selectedToken={selectedToken}
        onChange={token => setSelectedToken(token)}
      />
      <MultiLineSendInput
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
        {props.hasNonDelayedPermission === false ? (
          <div css={{ '> div': { p: { fontSize: 14 } } }}>
            {props.hasDelayedPermission ? (
              <Alert>
                <p>Time delayed proxies are not supported yet.</p>
              </Alert>
            ) : (
              <Alert>
                <p>
                  Your Vault does not have the proxy permission required to send token on behalf of the proxied account.
                </p>
              </Alert>
            )}
          </div>
        ) : (
          <div css={{ button: { height: 56, padding: '0 32px' } }}>
            <Button
              disabled={props.sends.length === 0 || hasInvalidRow || !props.hasNonDelayedPermission || !props.name}
              onClick={props.onNext}
              children="Review"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSendForm
