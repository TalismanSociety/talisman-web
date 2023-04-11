import { type ReactNode } from 'react'

export type HiddenDetailsProps = {
  children: ReactNode
  overlay: ReactNode
  hidden?: boolean
  variant?: 'dim'
}

const HiddenDetails = (props: HiddenDetailsProps) => (
  <div css={{ position: 'relative' }}>
    <div
      css={[
        { '> *': { transition: '.5s', filter: 'brightness(1) blur(0)' } },
        props.hidden &&
          (props.variant === 'dim'
            ? { '> *': { filter: 'brightness(0.8) blur(4px)' } }
            : { '> *': { filter: 'brightness(1.2) blur(4px)' } }),
      ]}
    >
      {props.children}
    </div>
    <div
      css={[
        {
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          inset: 0,
          transition: '.5s',
        },
        !props.hidden && {
          opacity: 0,
          pointerEvents: 'none',
        },
      ]}
    >
      {props.overlay}
    </div>
  </div>
)

export default HiddenDetails
