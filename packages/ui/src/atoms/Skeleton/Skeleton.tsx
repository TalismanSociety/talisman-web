import { keyframes, useTheme } from '@emotion/react'

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
    const theme = useTheme()
    return (
      <div
        {...props}
        css={[
          {
            borderRadius: '1.2rem',
            background: theme.color.surface,
          },
          animate && {
            animation: `${shimmer} 1s infinite`,
            background: `linear-gradient(90deg, ${theme.color.surface} 4%, ${theme.color.foregroundVariant} 25%, ${theme.color.surface} 36%)`,
            backgroundSize: '200% 100%',
          },
        ]}
      />
    )
  },
  Foreground: ({ animate, ...props }: SkeletonProps) => {
    const theme = useTheme()
    return (
      <div
        {...props}
        css={[
          {
            backgroundColor: theme.color.foreground,
            borderRadius: '1.2rem',
          },
          animate && {
            animation: `${shimmer} 1s infinite`,
            background: `linear-gradient(90deg, ${theme.color.foreground} 4%, ${theme.color.foregroundVariant} 25%, ${theme.color.foreground} 36%)`,
            backgroundSize: '200% 100%',
          },
        ]}
      />
    )
  },
}

export default Skeleton
