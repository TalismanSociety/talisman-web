import { StatusIndicator, type StatusIndicatorProps } from '@talismn/ui'
import { useMemo } from 'react'

export type StakeStatus = 'earning_rewards' | 'waiting' | 'not_nominating' | 'not_earning_rewards' | undefined

export type StakeStatusIndicatorProps = Omit<StatusIndicatorProps, 'status'> & {
  status?: StakeStatus
}

export const StakeStatusIndicator = (props: StakeStatusIndicatorProps) => (
  <StatusIndicator
    {...props}
    status={useMemo(() => {
      switch (props.status) {
        case 'earning_rewards':
          return 'success'
        case 'waiting':
          return 'warning'
        case 'not_nominating':
        case 'not_earning_rewards':
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
        case 'not_earning_rewards':
          return 'Not earing rewards'
        case undefined:
          return '...'
      }
    }, [props.status])}
  />
)
