import { useMemo } from 'react'

export type StatusIndicatorProps = {
  status: 'success' | 'warning' | 'error'
  tooltip?: string
}

const StatusIndicator = (props: StatusIndicatorProps) => (
  <div
    title={props.tooltip ?? props.status}
    css={{
      width: '0.8rem',
      height: '0.8rem',
      borderRadius: '0.4rem',
      backgroundColor: useMemo(() => {
        switch (props.status) {
          case 'success':
            return '#38D448'
          case 'warning':
            return '#F48F45'
          case 'error':
            return '#D22424'
        }
      }, [props.status]),
    }}
  />
)

export default StatusIndicator
