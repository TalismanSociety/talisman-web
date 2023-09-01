import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgDownloadCloud = (
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
      <g stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} clipPath="url(#a)">
        <path d="m8 17 4 4 4-4" />
        <path d="M12 12v9" />
        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8.001 8.001 0 0 0 2.532 6.268 8 8 0 0 0 3 16.29" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
const ForwardRef = forwardRef(SvgDownloadCloud)
export default ForwardRef
