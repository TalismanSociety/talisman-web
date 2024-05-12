import { IconContext } from '../context'
import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'

const SvgPolkadot = (
  props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number | string
  },
  ref: Ref<SVGSVGElement>
) => {
  const iconContext = React.useContext(IconContext)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size ?? iconContext.size ?? 24}
      height={props.size ?? iconContext.size ?? 24}
      fill="none"
      viewBox="0 0 1346 1410.3"
      ref={ref}
      {...props}
    >
      <ellipse cx={663} cy={147.9} fill="currentcolor" rx={254.3} ry={147.9} />
      <ellipse cx={663} cy={1262.3} fill="currentcolor" rx={254.3} ry={147.9} />
      <ellipse cx={180.5} cy={426.5} fill="currentcolor" rx={254.3} ry={148} transform="rotate(-60 180.499 426.56)" />
      <ellipse
        cx={1145.6}
        cy={983.7}
        fill="currentcolor"
        rx={254.3}
        ry={147.9}
        transform="rotate(-60 1145.575 983.768)"
      />
      <ellipse cx={180.5} cy={983.7} fill="currentcolor" rx={148} ry={254.3} transform="rotate(-30 180.45 983.72)" />
      <ellipse
        cx={1145.6}
        cy={426.6}
        fill="currentcolor"
        rx={147.9}
        ry={254.3}
        transform="rotate(-30 1145.522 426.601)"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgPolkadot)
export default ForwardRef
