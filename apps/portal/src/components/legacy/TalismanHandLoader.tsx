import TalismanHandLoading from '@assets/spin_red.gif'
import { type ImgHTMLAttributes } from 'react'

export const TalismanHandLoader = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img src={TalismanHandLoading} alt="Loading..." width="128px" height="128px" {...props} />
}
