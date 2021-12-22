import { ReactComponent as ChevronRight } from '@icons/chevron-right.svg'
import styled from 'styled-components'

import Button from './Button'

export const LeftRightPicker = styled(({ className, value, onLeftPick, onRightPick }) => {
  return (
    <div className={className}>
      <Button.Icon className="left-button picker-button" onClick={onLeftPick}>
        <ChevronRight />
      </Button.Icon>
      <div className="picker-value">{value}</div>
      <Button.Icon className="right-button picker-button" onClick={onRightPick}>
        <ChevronRight />
      </Button.Icon>
    </div>
  )
})`
  color: var(--color-text);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  .left-button {
    transform: rotate(180deg);
  }

  .picker-button {
    background: transparent;
    color: var(--color-text);
  }

  .picker-value {
    background: var(--color-controlBackground);
    padding: 0.8rem 2rem;
    border-radius: 1rem;
  }
`
