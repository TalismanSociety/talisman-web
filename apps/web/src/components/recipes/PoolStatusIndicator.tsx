import StatusIndicator, { StatusIndicatorProps } from '@components/atoms/StatusIndicator'
import { useMemo } from 'react'

export type PoolStatus = 'earning_rewards' | 'waiting' | 'not_nominating' | undefined

export type PoolStatusIndicatorProps = Omit<StatusIndicatorProps, 'status'> & {
  status?: PoolStatus
}

export const PoolStatusIndicator = (props: PoolStatusIndicatorProps) => (
  <StatusIndicator
    {...props}
    status={useMemo(() => {
      switch (props.status) {
        case 'earning_rewards':
          return 'success'
        case 'waiting':
          return 'warning'
        case 'not_nominating':
          return 'error'
        case undefined:
          return undefined
      }
    }, [props.status])}
    tooltip={useMemo(() => {
      switch (props.status) {
        case 'earning_rewards':
          return 'Earning rewards'
        case 'waiting':
          return 'Waiting'
        case 'not_nominating':
          return 'Not nominating'
        case undefined:
          return '...'
      }
    }, [props.status])}
  />
)
