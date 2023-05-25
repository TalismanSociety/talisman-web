import { useMemo } from 'react'
import CountUp, { type CountUpProps } from 'react-countup'

export type AnimatedNumberProps = Pick<CountUpProps, 'start' | 'end'> & {
  animate?: boolean
  decimals?: number
  formatter?: CountUpProps['formattingFn'] | Intl.NumberFormat
}

const AnimatedNumber = ({ animate = true, ...props }: AnimatedNumberProps) => {
  const formatter = useMemo(() => {
    if (props.formatter === undefined) {
      return
    }

    return props.formatter instanceof Intl.NumberFormat ? props.formatter.format.bind(props.formatter) : props.formatter
  }, [props.formatter])

  return <CountUp start={animate ? 0 : props.end} duration={0.4} preserveValue formattingFn={formatter} {...props} />
}

export default AnimatedNumber
