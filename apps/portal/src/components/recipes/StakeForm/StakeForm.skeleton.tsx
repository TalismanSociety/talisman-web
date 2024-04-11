import { Skeleton, useSurfaceColor, type SkeletonProps } from '@talismn/ui'

const StakeFormSkeleton = (_props: SkeletonProps) => (
  <Skeleton.Surface
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: useSurfaceColor(),
      borderRadius: '1.6rem',
      padding: '3.2rem',
      minHeight: '33.8rem',
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

export default StakeFormSkeleton
