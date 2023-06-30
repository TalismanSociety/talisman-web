import * as React from 'react'
import type { SVGProps } from 'react'
import { Ref, forwardRef } from 'react'
import { IconContext } from '../context'
const SvgRocket = (
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
        d="M12.387 5.027c.99-.989 2.75-1.694 4.524-1.947.871-.124 1.69-.131 2.35-.032.69.103 1.074.3 1.232.46.158.157.356.54.46 1.231.098.66.091 1.479-.033 2.35-.253 1.774-.958 3.535-1.947 4.524l-1.28 1.28-4.8 4.8-.893.893-1.693-1.693a1 1 0 0 0-1.414 1.414l2.4 2.4a1 1 0 0 0 1.414 0l.694-.694 1.742 2.901a1 1 0 0 0 1.564.193l3.2-3.2a1 1 0 0 0 .283-.848l-.73-5.105.927-.927c1.411-1.41 2.226-3.65 2.513-5.656.146-1.019.164-2.036.03-2.928-.129-.862-.421-1.748-1.023-2.35-.602-.602-1.488-.894-2.35-1.023-.892-.134-1.91-.115-2.928.03-2.006.287-4.245 1.102-5.656 2.513l-.927.926-5.105-.729a1 1 0 0 0-.848.283l-3.2 3.2a1 1 0 0 0 .192 1.565l2.902 1.74-.694.695a1 1 0 0 0 0 1.414l2.4 2.4a1 1 0 0 0 1.414-1.414L5.414 12l.893-.893-.68-.68.68.68 4.8-4.8 1.28-1.28Zm3.811 15.76-1.339-2.232 2.834-2.834.446 3.125-1.94 1.941Zm-7.92-14.48L5.446 9.141 3.213 7.8l1.94-1.94 3.126.446Zm-4.37 10.4a1 1 0 1 0-1.415-1.414l-1.6 1.6a1 1 0 1 0 1.414 1.414l1.6-1.6Zm2.4 2.4a1 1 0 1 0-1.415-1.414l-3.2 3.2a1 1 0 1 0 1.414 1.414l3.2-3.2Zm2.4 2.4a1 1 0 1 0-1.415-1.414l-1.6 1.6a1 1 0 1 0 1.414 1.414l1.6-1.6ZM13.96 8.72a1.16 1.16 0 1 1 2.32 0 1.16 1.16 0 0 1-2.32 0Zm1.16-3.16a3.16 3.16 0 1 0 0 6.32 3.16 3.16 0 0 0 0-6.32Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
const ForwardRef = forwardRef(SvgRocket)
export default ForwardRef
