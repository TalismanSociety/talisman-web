import { keyframes } from '@emotion/react'
import { useSurfaceColor, useSurfaceColorAtElevation } from '..'

export type SkeletonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  animate?: boolean
}

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
`

const Skeleton = {
  Surface: ({ animate = true, ...props }: SkeletonProps) => {
    const surfaceColor = useSurfaceColor()
    const elevatedSurfaceColor = useSurfaceColorAtElevation(x => x + 1)
    return (
      <div
        {...props}
        css={[
          {
            borderRadius: '1.2rem',
            background: surfaceColor,
          },
          animate && {
            animation: `${shimmer} 1s infinite`,
            background: `linear-gradient(90deg, ${surfaceColor} 4%, ${elevatedSurfaceColor} 25%, ${surfaceColor} 36%)`,
            backgroundSize: '200% 100%',
          },
        ]}
      />
    )
  },
  Foreground: ({ animate, ...props }: SkeletonProps) => {
    const elevatedSurfaceColor1 = useSurfaceColorAtElevation(x => x + 1)
    const elevatedSurfaceColor2 = useSurfaceColorAtElevation(x => x + 2)
    return (
      <div
        {...props}
        css={[
          {
            backgroundColor: elevatedSurfaceColor1,
            borderRadius: '1.2rem',
          },
          animate && {
            animation: `${shimmer} 1s infinite`,
            background: `linear-gradient(90deg, ${elevatedSurfaceColor1} 4%, ${elevatedSurfaceColor2} 25%, ${elevatedSurfaceColor1} 36%)`,
            backgroundSize: '200% 100%',
          },
        ]}
      />
    )
  },
}

export default Skeleton
