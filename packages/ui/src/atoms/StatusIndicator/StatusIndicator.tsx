import { useTheme } from '@emotion/react'

import Tooltip from '../Tooltip'

export type StatusIndicatorProps = {
  className?: string
  status?: 'success' | 'warning' | 'error'
  tooltip?: string
}

const StatusIndicator = (props: StatusIndicatorProps) => {
  const theme = useTheme()
  return (
    <Tooltip content={props.tooltip}>
      <div
        className={props.className}
        css={{
          width: '0.8rem',
          minWidth: '0.8rem',
          height: '0.8rem',
          borderRadius: '0.4rem',
          transition: '0.5s',
          backgroundColor: (() => {
            switch (props.status) {
              case 'success':
                return '#38D448'
              case 'warning':
                return '#F48F45'
              case 'error':
                return '#D22424'
              case undefined:
                return theme.color.foregroundVariant
            }
          })(),
        }}
      />
    </Tooltip>
  )
}

export default StatusIndicator
