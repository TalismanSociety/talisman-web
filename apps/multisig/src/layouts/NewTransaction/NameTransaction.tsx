import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'
import { NewTransactionHeader } from './NewTransactionHeader'

export const NameTransaction = (props: {
  onCancel?: () => void
  name: string
  setName: (s: string) => void
  onNext: () => void
}) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        width: '100%',
      }}
    >
      <div>
        <NewTransactionHeader>What's this transaction for?</NewTransactionHeader>
        <p css={{ marginTop: 4 }}>Give your transaction a description</p>
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
          width: 100%;
          button {
            height: 56px;
            width: 100%;
          }
        `}
      >
        <Button disabled={props.name.length === 0} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}
