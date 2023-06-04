import { useTheme } from '@emotion/react'
import { Skeleton, type SkeletonProps } from '@talismn/ui'

// TODO: copy of `StakeForm` skeleton
// implement better skeleton once we have time
const TransportFormSkeleton = (props: SkeletonProps) => {
  const theme = useTheme()
  return (
    <Skeleton.Surface
      {...props}
      css={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.color.surface,
        borderRadius: '1.6rem',
        padding: '2.4rem',
        width: '42.8rem',
        maxWidth: '100%',
      }}
    >
      <div css={{ marginBottom: '4.7rem' }}>
        <Skeleton.Foreground css={{ height: '4rem', marginBottom: '2.4rem' }} />
        <Skeleton.Foreground css={{ height: '6.8rem' }} />
      </div>
      <Skeleton.Foreground css={{ height: '4rem' }} />
    </Skeleton.Surface>
  )
}

export default TransportFormSkeleton
