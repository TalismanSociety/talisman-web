import { keyframes, useTheme } from '@emotion/react'

export type SkeletonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
`

const Skeleton = {
  Surface: (props: SkeletonProps) => {
    const theme = useTheme()
    return (
      <div
        {...props}
        css={{
          borderRadius: '1.2rem',
          animation: `${shimmer} 1s infinite`,
          background: `linear-gradient(90deg, ${theme.color.surface} 1%, ${theme.color.foreground} 25%, ${theme.color.surface} 50%)`,
          backgroundSize: '200% 100%',
        }}
      />
    )
  },
  Foreground: (props: SkeletonProps) => {
    const theme = useTheme()
    return (
      <div
        {...props}
        css={{
          backgroundColor: theme.color.foreground,
          borderRadius: '1.2rem',
        }}
      />
    )
  },
}

export default Skeleton
