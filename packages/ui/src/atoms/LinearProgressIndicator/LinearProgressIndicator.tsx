import { useTheme } from '@emotion/react'
import { useSurfaceColorAtElevation } from '../Surface'

export type LinearProgressIndicatorProps = {
  className?: string
  value: number
  contentColor?: string
  least?: number
  optimum?: number
}

const LinearProgressIndicator = (props: LinearProgressIndicatorProps) => {
  const theme = useTheme()
  return (
    <div
      className={props.className}
      css={{
        position: 'relative',
        backgroundColor: useSurfaceColorAtElevation(x => x + 1),
        height: '0.6rem',
        borderRadius: theme.shape.full,
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          position: 'absolute',
          inset: 0,
          backgroundColor:
            props.contentColor ??
            (props.value > (props.optimum ?? 0)
              ? '#38D448'
              : props.value > (props.least ?? 0)
              ? '#F48F45'
              : theme.color.error),
          transition: 'ease 1s',
          transform: `scaleX(${props.value})`,
          transformOrigin: 'left',
        }}
      />
    </div>
  )
}

export default LinearProgressIndicator
