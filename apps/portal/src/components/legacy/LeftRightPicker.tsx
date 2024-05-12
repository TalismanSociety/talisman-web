import styled from '@emotion/styled'
import ChevronRight from '../../assets/icons/chevron-right.svg?react'

import { ButtonIcon } from './Button'

type LeftRightPickerProps = {
  className?: string
  value: string
  onLeftPick: () => void
  onRightPick: () => void
}

export const LeftRightPicker = styled(({ className, value, onLeftPick, onRightPick }: LeftRightPickerProps) => {
  return (
    <div className={className}>
      <ButtonIcon className="left-button picker-button" onClick={onLeftPick}>
        <ChevronRight />
      </ButtonIcon>
      <div className="picker-value">{value}</div>
      <ButtonIcon className="right-button picker-button" onClick={onRightPick}>
        <ChevronRight />
      </ButtonIcon>
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
