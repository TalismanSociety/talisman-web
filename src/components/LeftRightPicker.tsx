import { ReactComponent as ChevronDown } from '@icons/chevron-down.svg'
import styled from 'styled-components'

import Button from './Button'

export const LeftRightPicker = styled(({ className, value, onLeftPick, onRightPick }) => {
  return (
    <div className={className}>
      <Button.Icon className="nav-toggle-left" onClick={onLeftPick}>
        <ChevronDown />
      </Button.Icon>
      <div className="nft-number" style={{ color: 'var(--color-text)' }}>
        {value}
      </div>
      <Button.Icon className="nav-toggle-right" onClick={onRightPick}>
        <ChevronDown />
      </Button.Icon>
    </div>
  )
})`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`
