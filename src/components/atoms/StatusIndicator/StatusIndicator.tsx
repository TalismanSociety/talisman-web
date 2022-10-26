import Tooltip from '../Tooltip'

export type StatusIndicatorProps = {
  status: 'success' | 'warning' | 'error'
  tooltip?: string
}

const StatusIndicator = (props: StatusIndicatorProps) => (
  <Tooltip content={props.tooltip}>
    {tooltipProps => (
      <div
        {...tooltipProps}
        css={{
          width: '0.8rem',
          minWidth: '0.8rem',
          height: '0.8rem',
          borderRadius: '0.4rem',
          backgroundColor: (() => {
            switch (props.status) {
              case 'success':
                return '#38D448'
              case 'warning':
                return '#F48F45'
              case 'error':
                return '#D22424'
            }
          })(),
        }}
      />
    )}
  </Tooltip>
)

export default StatusIndicator
