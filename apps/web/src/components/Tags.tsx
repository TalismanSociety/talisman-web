import { Pill } from '@components'
import styled from '@emotion/styled'
import { useSet } from '@util/hooks'
import { useEffect } from 'react'

type StyledNoCrowdloansPlaceholderProps = {
  inital: any[]
  className?: string
  options?: any // Best to double check what this data type might be
  onChange: (e: any) => void
}

export default styled(
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
