import { useTheme } from '@emotion/react'
import { Skeleton, type SkeletonProps } from '@talismn/ui'

// TODO: copy of `StakeForm` skeleton
// implement better skeleton once we have time
const TeleportFormSkeleton = (props: SkeletonProps) => {
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
        padding: '3.2rem',
        minHeight: '33.8rem',
        width: '47rem',
        maxWidth: '100%',
      }}
    >
      <div>
        <Skeleton.Foreground css={{ height: '5.5rem', marginBottom: '1.6rem' }} />
        <div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
          <Skeleton.Foreground css={{ width: '9.7rem', height: '1.7rem' }} />
          <Skeleton.Foreground css={{ width: '9.7rem', height: '1.7rem' }} />
        </div>
        <Skeleton.Foreground css={{ height: '6.8rem', marginBottom: '0.8rem' }} />
        <Skeleton.Foreground css={{ width: '9.7rem', height: '1.7rem' }} />
      </div>
      <Skeleton.Foreground css={{ height: '4.26334rem' }} />
    </Skeleton.Surface>
  )
}

export default TeleportFormSkeleton
