/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from '@emotion/styled'

import { FieldWrapper } from '@/components/legacy/FieldWrapper'

type InputProps = {
  className?: string
  onChange?: (e: any) => void
  type?: string
  inputMode?: string
  pattern?: string
  prefix?: any
  suffix?: React.ReactNode
  label?: string
  dim?: boolean
  value?: any
  placeholder?: string
  disabled?: boolean
}

/** @deprecated */
export const Input = styled(({ className, onChange = _v => {}, prefix, suffix, label, dim, ...rest }: InputProps) => (
  <FieldWrapper type="input" className={className} prefix={prefix} suffix={suffix} label={label} dim={dim}>
    <input type="text" onChange={e => onChange(e?.target?.value)} {...(rest as any)} />
  </FieldWrapper>
))``
