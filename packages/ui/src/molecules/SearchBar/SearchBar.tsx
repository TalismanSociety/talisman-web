import { Search, XCircle } from '@talismn/icons'
import { useRef } from 'react'
import { TextInput, type TextInputProps } from '..'

export type SearchBarProps = TextInputProps

const SearchBar = (props: SearchBarProps) => {
  const ref = useRef<HTMLInputElement>(null)
  const hasValue = props.value?.toString().trim() !== ''

  return (
    <TextInput
      ref={ref}
      {...props}
      leadingIcon={<Search size="1.25em" />}
      trailingIcon={
        <XCircle
          size="1.25em"
          css={[
            { cursor: 'pointer', transition: 'ease 0.5s' },
            !hasValue && {
              transform: 'translateX(50%)',
              opacity: 0,
              pointerEvents: 'none',
            },
          ]}
          onClick={() => {
            if (ref.current !== null) {
              Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(ref.current, '')
              ref.current.dispatchEvent(new Event('input', { bubbles: true }))
            }
          }}
        />
      }
    />
  )
}

export default SearchBar
