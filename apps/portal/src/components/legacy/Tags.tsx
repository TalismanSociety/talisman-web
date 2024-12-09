import styled from '@emotion/styled'
import { useEffect } from 'react'

import { Pill } from '@/components/legacy/Pill'
import { useSet } from '@/util/hooks'

type StyledNoCrowdloansPlaceholderProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inital: any[]
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any // Best to double check what this data type might be
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void
}

export const Tags = styled(
  ({ inital = [], options = {}, className, onChange = () => {}, ...rest }: StyledNoCrowdloansPlaceholderProps) => {
    const [tags, { add, remove }] = useSet(inital)

    // fire onchange when tags change
    useEffect(() => onChange(Array.from(tags)), [tags?.length]) // eslint-disable-line

    return (
      <div className={`tabs ${className ?? ''}`} {...rest}>
        {Object.keys(options).map(key => (
          <Pill key={key} onClick={() => (tags?.includes(key) ? remove(key) : add(key))} active={tags?.includes(key)}>
            {options[key]}
          </Pill>
        ))}
      </div>
    )
  }
)`
  display: block;

  > .pill {
    opacity: 0.7;

    &:hover,
    &[data-active='true'],
    &[data-active='false']:hover {
      opacity: 1;
    }

    & + .pill {
      margin-left: 1.1em;
    }
  }
`
