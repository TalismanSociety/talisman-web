import StatusIndicator, { StatusIndicatorProps } from '@components/atoms/StatusIndicator'
import { useMemo } from 'react'

export const PoolStatusIndicator = (props: StatusIndicatorProps) => (
  <StatusIndicator
    {...props}
    tooltip={useMemo(() => {
      switch (props.status) {
        case 'success':
          return 'Nominating'
        case 'warning':
          return 'Waiting'
        case 'error':
          return 'Not nominating'
      }
    }, [props.status])}
  />
)
