import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgTalismanHand = (
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
        fill="currentcolor"
        d="M9.774 17.266c0 1.235.994 2.238 2.226 2.252a2.252 2.252 0 0 0 0-4.504 2.252 2.252 0 0 0-2.226 2.252Z"
      />
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="M5.2 13.386c-.228.497-.9.673-1.287.286l-.71-.71A1.877 1.877 0 0 0 .55 15.618l5.733 5.733A7.49 7.49 0 0 0 12 24.022a7.49 7.49 0 0 0 5.717-2.672l5.733-5.733a1.877 1.877 0 0 0-2.654-2.654l-.709.709c-.387.386-1.059.211-1.287-.286a.743.743 0 0 1-.07-.311V4.504a1.877 1.877 0 0 0-3.753 0v4.338c0 .373-.382.626-.738.514a.545.545 0 0 1-.388-.512V1.877A1.877 1.877 0 0 0 12 0a1.877 1.877 0 0 0-1.851 1.877v6.967a.545.545 0 0 1-.388.512c-.356.112-.738-.141-.738-.514V4.504a1.877 1.877 0 0 0-3.753 0v8.57a.743.743 0 0 1-.07.312Zm6.8.127c-3.305.02-5.98 3.753-5.98 3.753S8.696 21 12 21.019c3.305-.02 5.98-3.753 5.98-3.753s-2.675-3.734-5.98-3.753Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgTalismanHand)
export default ForwardRef
