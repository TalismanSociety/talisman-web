import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'

export const NameTransaction = (props: {
  onCancel: () => void
  name: string
  setName: (s: string) => void
  onNext: () => void
}) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        maxWidth: 490,
        width: '100%',
      }}
    >
      <div css={{ textAlign: 'center' }}>
        <h1>What's this transaction for?</h1>
        <p css={{ marginTop: 16 }}>Give your transaction a description</p>
      </div>
      <div
        className={css`
          height: 56px;
          color: var(--color-offWhite);
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder='e.g. "Reimburse transaction fees"'
          value={props.name}
          onChange={event => props.setName(event.target.value)}
        />
      </div>
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
        <Button onClick={props.onCancel} children={<h3>Cancel</h3>} variant="outlined" />
        <Button disabled={props.name.length === 0} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}
