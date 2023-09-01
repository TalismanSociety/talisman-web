import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgCalculate = (
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
      viewBox="0 0 24 25"
      ref={ref}
      {...props}
    >
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m17.5 6.522-11 11m2-7v-4m-2 2h4m3 7h4m-9.7 5.5h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.31c.327-.643.327-1.483.327-3.163v-8.4c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.31c-.642-.328-1.482-.328-3.162-.328H7.8c-1.68 0-2.52 0-3.162.327A3 3 0 0 0 3.327 4.66C3 5.302 3 6.142 3 7.822v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgCalculate)
export default ForwardRef
