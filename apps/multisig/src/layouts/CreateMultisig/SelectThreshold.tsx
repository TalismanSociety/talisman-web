import Slider from '@components/Slider'
import { css } from '@emotion/css'
import { Button } from '@talismn/ui'
import { device } from '@util/breakpoints'

import { Step } from '.'

const SelectThreshold = (props: {
  setStep: React.Dispatch<React.SetStateAction<Step>>
  setThreshold: React.Dispatch<React.SetStateAction<number>>
  threshold: number
  max: number
}) => {
  return (
    <div
      className={css`
        display: grid;
        grid-template-rows: 1fr;
        justify-items: center;
        align-content: center;
      `}
    >
      <h1>Select threshold</h1>
      <p
        className={css`
          margin-top: 16px;
          font-size: 16px;
        `}
      >
        Select the amount of approvals required to execute a transaction.
      </p>
      <div
        className={css`
          background: var(--color-controlBackground);
          border-radius: 16px;
          width: 100%;
          margin-top: 48px;
          padding: 24px 44px;
        `}
      >
        <div
          className={css`
            display: flex;
            justify-content: center;
            margin-bottom: 17px;
          `}
        >
          <h1
            className={css`
              color: var(--color-primary);
            `}
          >
            {props.threshold}&nbsp;
          </h1>
          <h1
            className={css`
              color: var(--color-dim);
            `}
          >{`/ ${props.max}`}</h1>
        </div>
        <Slider
          value={props.threshold}
          min={2}
          max={props.max}
          step={1}
          onChange={t => {
            if (typeof t === 'number' && t > 1) {
              props.setThreshold(t)
            }
          }}
          leftLabel="Less Secure"
          rightLabel="More Secure"
        />
      </div>
      <div
        className={css`
          display: flex;
          gap: 16px;
        `}
      >
        <Button
          onClick={() => {
            props.setStep('addMembers')
          }}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
            @media ${device.lg} {
              width: 303px;
            }
          `}
          children={<h3>Back</h3>}
          variant="outlined"
        />
        <Button
          disabled={props.threshold < 2}
          onClick={() => {
            props.setStep('confirmation')
          }}
          className={css`
            margin-top: 48px;
            width: 240px;
            height: 56px;
            @media ${device.lg} {
              width: 303px;
            }
          `}
          children={<h3>Next</h3>}
        />
      </div>
    </div>
  )
}

export default SelectThreshold
