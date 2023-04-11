import { useMemo } from 'react'
import CountUp, { type CountUpProps } from 'react-countup'

export type AnimatedNumberProps = Pick<CountUpProps, 'start' | 'end'> & {
  decimals?: number
  formatter?: CountUpProps['formattingFn'] | Intl.NumberFormat
}

const AnimatedNumber = (props: AnimatedNumberProps) => {
  const formatter = useMemo(() => {
    if (props.formatter === undefined) {
      return
    }

    return props.formatter instanceof Intl.NumberFormat ? props.formatter.format.bind(props.formatter) : props.formatter
  }, [])

  return <CountUp duration={0.4} preserveValue formattingFn={formatter} {...props} />
}

export default AnimatedNumber
