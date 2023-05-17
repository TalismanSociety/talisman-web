import styled from '@emotion/styled'
import useImageWithFallback from '@util/useImageWithFallback'
import { type PropsWithChildren } from 'react'

const Poster = styled(
  ({
    title,
    subtitle,
    backgroundImage,
    fallbackBackgroundImage,
    children,
    className,
  }: PropsWithChildren<{
    title?: string
    subtitle?: string
    backgroundImage?: string
    fallbackBackgroundImage?: string
    className?: string
  }>) => {
    const imageSrc = useImageWithFallback(backgroundImage, fallbackBackgroundImage)

    return (
      <section
        className={`${className ?? ''} poster`}
        style={{
          backgroundImage: `url(${imageSrc ?? ''})`,
        }}
      >
        <span className="content">
          <h1>{title}</h1>
          <h2 dangerouslySetInnerHTML={{ __html: subtitle ?? '' }} />
          <div className="children">{children}</div>
        </span>
      </section>
    )
  }
)`
  display: block;
  width: 100%;
  height: 24vw;
  min-height: 34rem;
  max-height: 60rem;
  background-color: rgba(0, 0, 0, 0.1);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  position: relative;
  padding: 3vw;

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;

    h1 {
      margin: 0;
    }

    h2 {
      margin: 1.6vw 0 2.9vw;
      line-height: 1.3em;
    }

    > .children {
      margin: 0;
    }
  }
`

export default Poster
