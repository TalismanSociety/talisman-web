import * as React from 'react'
import { SVGProps } from 'react'
const SvgPieChart = (props: SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21.21 15.89C20.5739 17.3945 19.5788 18.7202 18.3119 19.7513C17.045 20.7824 15.5448 21.4874 13.9425 21.8048C12.3401 22.1221 10.6845 22.0421 9.12018 21.5718C7.55591 21.1015 6.13066 20.2551 4.96906 19.1067C3.80745 17.9582 2.94485 16.5428 2.45667 14.984C1.96849 13.4251 1.8696 11.7705 2.16863 10.1646C2.46767 8.55878 3.15553 7.05063 4.17208 5.77203C5.18863 4.49343 6.50292 3.48332 8.00004 2.83"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
export default SvgPieChart
