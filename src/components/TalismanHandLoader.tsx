import TalismanHandLoading from '@assets/spin_red.gif'
import { ImgHTMLAttributes } from 'react'

export const TalismanHandLoader = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={TalismanHandLoading} alt="Loading..." width="64px" height="64px" {...props} />
}
