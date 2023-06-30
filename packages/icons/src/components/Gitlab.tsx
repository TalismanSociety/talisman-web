import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgGitlab = (
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
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          stroke="currentcolor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.43.43 0 0 1 5.4 2a.42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51a.43.43 0 0 1 .69-.16.42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
const ForwardRef = forwardRef(SvgGitlab)
export default ForwardRef
