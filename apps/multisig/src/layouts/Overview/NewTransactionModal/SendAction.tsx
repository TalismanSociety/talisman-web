import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'
import { useState } from 'react'

const SendAction = (props: { onCancel: () => void }) => {
  const [name, setName] = useState('')
  const [network, setNetwork] = useState('')
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        padding: 32px;
        height: 100%;
      `}
    >
      <h1>What's this transaction for?</h1>
      <span css={{ paddingTop: '24px' }}>Give your transaction a description</span>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder='e.g. "Reimburse transaction fees"'
          value={name}
          onChange={event => setName(event.target.value)}
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
        <Button onClick={props.onCancel} children={<h3>Cancel</h3>} variant="outlined" />
        <Button disabled={name.length === 0} onClick={() => {}} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

export default SendAction
