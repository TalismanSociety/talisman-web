import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgEyePlus = (
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
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="M13.594 3.126A10.113 10.113 0 0 0 12 3C8.1 3 5.104 5.226 3.145 7.316a20.676 20.676 0 0 0-2.831 3.85 12.339 12.339 0 0 0-.192.354l-.011.022-.003.007-.002.002L1 12l-.894-.448a1 1 0 0 0 0 .895L1 12l-.894.448.002.003.003.007.011.022.04.077c.036.066.086.16.152.277a20.682 20.682 0 0 0 2.831 3.85C5.105 18.774 8.1 21 12 21c3.9 0 6.895-2.227 8.855-4.316a20.683 20.683 0 0 0 2.831-3.85 11.81 11.81 0 0 0 .192-.354l.011-.022.003-.007.002-.003L23 12l.894.447a1 1 0 0 0 0-.895L23 12l.894-.448v-.001l-.002-.002-.003-.007-.011-.022a11.778 11.778 0 0 0-.192-.354 18.587 18.587 0 0 0-.991-1.571 5.665 5.665 0 0 1-1.627 1.163A19.004 19.004 0 0 1 21.859 12a18.684 18.684 0 0 1-2.464 3.316C17.605 17.226 15.101 19 12 19c-3.1 0-5.604-1.774-7.395-3.684A18.68 18.68 0 0 1 2.14 12a18.673 18.673 0 0 1 2.464-3.316C6.395 6.774 8.9 5 12 5c.351 0 .694.022 1.03.065a5.612 5.612 0 0 1 .564-1.94Z"
        clipRule="evenodd"
      />
      <path
        stroke="currentcolor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      />
      <path
        fill="currentcolor"
        fillRule="evenodd"
        d="M19.85 3.4a1 1 0 1 0-2 0v1.25H16.6a1 1 0 1 0 0 2h1.25V7.9a1 1 0 1 0 2 0V6.65h1.25a1 1 0 1 0 0-2h-1.25V3.4Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgEyePlus)
export default ForwardRef
