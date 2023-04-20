import { css } from '@emotion/css'
import { Button, TextInput } from '@talismn/ui'
import { device } from '@util/breakpoints'

const NameVault = (props: {
  onBack: () => void
  onNext: () => void
  setName: React.Dispatch<React.SetStateAction<string>>
  name: string
}) => {
  return (
    <div
      className={css`
        display: grid;
        justify-items: center;
        align-content: center;
      `}
    >
      <h1>Name your vault</h1>
      <p
        className={css`
          margin-top: 16px;
        `}
      >
        Give your vault a name. You can always change this later.
      </p>
      <div
        className={css`
          margin-top: 48px;
          width: 490px;
          height: 56px;
          color: var(--color-offWhite);
          @media ${device.lg} {
            width: 623px;
          }
        `}
      >
        <TextInput
          className={css`
            font-size: 18px !important;
          `}
          placeholder='e.g. "Paraverse Foundation"'
          value={props.name}
          onChange={event => props.setName(event.target.value)}
        />
      </div>
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
        <Button disabled={props.name.length === 0} onClick={props.onNext} children={<h3>Next</h3>} />
      </div>
    </div>
  )
}

export default NameVault
