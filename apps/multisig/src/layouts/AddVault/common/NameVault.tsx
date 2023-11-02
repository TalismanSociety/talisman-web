import { css } from '@emotion/css'
import { TextInput } from '@talismn/ui'
import { CancleOrNext } from './CancelOrNext'

const NameVault = (props: {
  onBack?: () => void
  onNext: () => void
  setName: React.Dispatch<React.SetStateAction<string>>
  name: string
}) => {
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    props.onNext()
  }
  return (
    <form
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
        gap: 48px;
        max-width: 540px;
      `}
      onSubmit={handleNext}
    >
      <div>
        <h1>Name your vault</h1>
        <p css={{ textAlign: 'center', marginTop: 8 }}>
          The Vault represents the overall unit of your Proxy Account and linked Multisig, and the Vault name is stored
          offchain.
        </p>
      </div>
      <div
        css={({ color }) => ({
          color: color.offWhite,
          height: 56,
          width: '100%',
        })}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder='Enter a name (e.g. "Paraverse Foundation")'
          value={props.name}
          onChange={event => props.setName(event.target.value)}
        />
      </div>
      <CancleOrNext
        block
        cancel={
          props.onBack
            ? {
                onClick: props.onBack,
                children: <h3>Back</h3>,
                type: 'button',
              }
            : undefined
        }
        next={{
          disabled: props.name.length === 0,
          onClick: handleNext,
          type: 'submit',
        }}
      />
    </form>
  )
}

export default NameVault
