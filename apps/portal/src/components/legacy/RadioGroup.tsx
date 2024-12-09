/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from '@emotion/styled'

import { FieldWrapper } from '@/components/legacy/FieldWrapper'
import { Pill } from '@/components/legacy/Pill'

type RadioGroupProps = {
  value: string
  options?: any
  className?: string
  onChange?: (value: string) => void
  small?: boolean
  primary?: boolean
  secondary?: boolean
}

export const RadioGroup = styled(
  ({ value, options = {}, onChange = () => {}, small, primary, secondary, className }: RadioGroupProps) => (
    <FieldWrapper type="radiogroup" className={className}>
      {options.map((option: Record<string, any>) => (
        <Pill
          key={option?.['key']}
          onClick={() => onChange(option?.['key'])}
          active={option?.['key'] === value}
          small={small}
          primary={primary}
          secondary={secondary}
        >
          {option?.['value']}
        </Pill>
      ))}
    </FieldWrapper>
  )
)`
  .children {
    display: flex;
    gap: 0.25rem;
    box-shadow: none;
    overflow: visible;
    &:hover {
      box-shadow: none;
    }

    background: var(--color-controlBackground);
    padding: 0.25rem;
    border-radius: 1.5rem;
  }
`
