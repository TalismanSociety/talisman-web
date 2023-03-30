import { keyframes } from '@emotion/react'
import { Loader } from '@talismn/icons'

export type CircularProgressIndicatorProps = {
  size?: string | number
}

const fade = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`

const CircularProgressIndicator = (props: CircularProgressIndicatorProps) => (
  <Loader
    size={props.size}
    css={{
      path: {
        'animation': `${fade} 1s linear infinite`,
        '&:nth-child(1)': {},
        '&:nth-child(8)': {
          animationDelay: '0.125s',
        },
        '&:nth-child(6)': {
          animationDelay: '0.25s',
        },
        '&:nth-child(4)': {
          animationDelay: '0.375s',
        },
        '&:nth-child(2)': {
          animationDelay: '0.5s',
        },
        '&:nth-child(7)': {
          animationDelay: '0.625s',
        },
        '&:nth-child(5)': {
          animationDelay: '0.75s',
        },
        '&:nth-child(3)': {
          animationDelay: '0.875s',
        },
      },
    }}
  />
)

export default CircularProgressIndicator
