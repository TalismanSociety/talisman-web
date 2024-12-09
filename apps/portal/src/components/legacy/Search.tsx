/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from '@emotion/styled'

import SearchIcon from '@/assets/icons/search.svg?react'
import IconClear from '@/assets/icons/x-circle.svg?react'
import { FieldWrapper } from '@/components/legacy/FieldWrapper'

type SearchProps = {
  className?: string
  value?: string
  onChange?: (e: any) => void
  placeholder?: string
}

export const Search = styled(({ value, className, onChange = () => {}, ...rest }: SearchProps) => (
  <FieldWrapper
    type="search"
    prefix={<SearchIcon />}
    suffix={<IconClear data-display={value !== ''} onClick={() => onChange('')} />}
    className={className}
  >
    <input type="text" onChange={e => onChange(e?.target?.value)} value={value} {...rest} />
  </FieldWrapper>
))`
  .children {
    [type='text'] {
      background: var(--color-controlBackground);
    }
    .suffix {
      svg {
        transform: translatex(50%);
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s;
        cursor: pointer;
        &[data-display='true'] {
          opacity: 0.4;
          pointer-events: all;
          transform: translatex(0);
        }
      }
    }
  }
`
