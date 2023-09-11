import { useEffect, useMemo, useState } from 'react'
import CountUp, { type CountUpProps } from 'react-countup'

export type AnimatedNumberProps = Pick<CountUpProps, 'start' | 'end'> & {
  animate?: boolean
  decimals?: number
  formatter?: CountUpProps['formattingFn'] | Intl.NumberFormat
}

const AnimatedNumber = ({ animate = true, ...props }: AnimatedNumberProps) => {
  // IMPORTANT: countup has a bug where not explicitly re-render on formatting function change may reset number to 0
  const [key, setKey] = useState(0)

  const formatter = useMemo(() => {
    if (props.formatter === undefined) {
      return
    }

    return props.formatter instanceof Intl.NumberFormat ? props.formatter.format.bind(props.formatter) : props.formatter
  }, [props.formatter])

  useEffect(() => setKey(x => x + 1), [formatter])

  return (
    <CountUp
      key={key}
      start={animate ? 0 : props.end}
      duration={0.4}
      preserveValue
      formattingFn={formatter}
      {...props}
    />
  )
}

export default AnimatedNumber
