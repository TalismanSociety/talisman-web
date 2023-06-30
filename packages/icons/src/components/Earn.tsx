import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgEarn = (
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
        d="M13.53 8.374a3.5 3.5 0 1 1 .941-4.704M6 20.11h2.61c.34 0 .679.04 1.009.12l2.758.671c.598.146 1.222.16 1.826.043l3.05-.594a4.204 4.204 0 0 0 2.127-1.107l2.158-2.1a1.503 1.503 0 0 0 0-2.168 1.61 1.61 0 0 0-2.06-.143l-2.515 1.835c-.36.263-.799.405-1.25.405h-2.427 1.545c.871 0 1.577-.687 1.577-1.534v-.307c0-.703-.492-1.317-1.194-1.487l-2.385-.58a5.03 5.03 0 0 0-1.186-.142c-.965 0-2.711.799-2.711.799L6 15.047m14-8.525a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-18 8.1v5.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h.8c.56 0 .84 0 1.054-.11a1 1 0 0 0 .437-.437C6 21.262 6 20.982 6 20.422v-5.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437c-.214-.109-.494-.109-1.054-.109h-.8c-.56 0-.84 0-1.054.11a1 1 0 0 0-.437.436C2 13.782 2 14.062 2 14.622Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgEarn)
export default ForwardRef
