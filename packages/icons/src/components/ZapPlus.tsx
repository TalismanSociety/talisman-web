import { IconContext } from '../context'
import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'

const SvgZapPlus = (
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
      viewBox="0 0 20 20"
      ref={ref}
      {...props}
    >
      <path
        fill="currentcolor"
        d="m10.833 1.667.695.087a.7.7 0 0 0-1.232-.535l.537.448Zm-8.333 10-.538-.448a.7.7 0 0 0 .538 1.148v-.7Zm7.5 0 .693.101a.7.7 0 0 0-.693-.801v.7Zm0-3.334-.695-.086a.7.7 0 0 0 .695.786v-.7ZM9 18.5l-.693-.101a.7.7 0 0 0 1.188.596L9 18.5Zm2.495-1.505a.7.7 0 0 0-.99-.99l.99.99Zm4.474-7.95a.7.7 0 1 0 1.063.91l-1.063-.91Zm1.531-.712.532.456a.7.7 0 0 0-.532-1.156v.7ZM14.3 17a.7.7 0 1 0 1.4 0h-1.4Zm1.4-6a.7.7 0 1 0-1.4 0h1.4ZM12 13.3a.7.7 0 1 0 0 1.4v-1.4Zm6 1.4a.7.7 0 1 0 0-1.4v1.4ZM10.296 1.219l-8.334 10 1.076.896 8.333-10-1.075-.896ZM2.5 12.367H10v-1.4H2.5v1.4Zm8.195-3.947.833-6.666-1.39-.174-.833 6.667 1.39.173Zm-1.388 3.145-1 6.834 1.386.203 1-6.834-1.386-.203Zm.188 7.43 2-2-.99-.99-2 2 .99.99Zm7.537-9.04 1-1.166-1.064-.911-1 1.167 1.064.91ZM15.7 17v-3h-1.4v3h1.4Zm0-3v-3h-1.4v3h1.4Zm-3.7.7h3v-1.4h-3v1.4Zm3 0h3v-1.4h-3v1.4Zm2.5-7.067H10v1.4h7.5v-1.4Z"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgZapPlus)
export default ForwardRef
