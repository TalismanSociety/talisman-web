import styled from '@emotion/styled'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

const Image = styled(
  ({ src, alt, className, ...rest }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => (
    <div className={`image ${className ?? ''}`} {...rest}>
      <img src={src ?? ''} alt={alt} />
    </div>
  )
)`
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  img {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

export default Image
