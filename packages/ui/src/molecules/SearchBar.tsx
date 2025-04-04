import { Search, XCircle } from '@talismn/web-icons'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import type { TextInputProps } from './TextInput'
import { TextInput } from './TextInput'

export type SearchBarProps = TextInputProps

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>((props, ref) => {
  const innerRef = useRef<HTMLInputElement>(null)
  const hasValue = props.value?.toString().trim() !== ''

  useImperativeHandle(
    ref,
    () =>
      // @ts-expect-error
      innerRef.current
  )

  return (
    <TextInput
      ref={innerRef}
      {...props}
      leadingIcon={<Search size="1em" />}
      trailingIcon={
        <XCircle
          size="1em"
          css={[
            { cursor: 'pointer', transition: 'ease 0.5s' },
            !hasValue && {
              transform: 'translateX(50%)',
              opacity: 0,
              pointerEvents: 'none',
            },
          ]}
          onClick={() => {
            if (innerRef.current !== null) {
              Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(
                innerRef.current,
                ''
              )
              innerRef.current.dispatchEvent(new Event('input', { bubbles: true }))
              innerRef.current.focus()
            }
          }}
        />
      }
    />
  )
})
