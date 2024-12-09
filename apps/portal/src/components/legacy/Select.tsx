/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from '@emotion/styled'

import ChevronDown from '@/assets/icons/chevron-down.svg?react'
import { FieldWrapper } from '@/components/legacy/FieldWrapper'

type SelectProps = {
  value?: string
  options?: any
  className?: string
  suffix?: boolean
  onChange: (value: string) => void
}

export const Select = styled(
  ({ value, options, className, suffix = true, onChange = (_v: string) => {}, ...rest }: SelectProps) => (
    <FieldWrapper type="select" suffix={suffix ? <ChevronDown /> : null} className={className}>
      <select onChange={e => onChange(e?.target?.value)} {...rest}>
        {options.map(({ key, value }: { key: string; value: string }) => (
          <option key={key} value={key}>
            {value}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
)`
  select {
    appearance: none;
    background-color: var(--color-controlBackground);
    border: none;
  }
`
