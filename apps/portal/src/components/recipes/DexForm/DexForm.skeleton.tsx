import { Skeleton, useSurfaceColor, type SkeletonProps } from '@talismn/ui'

const DexFormSkeleton = (props: SkeletonProps) => (
  <Skeleton.Surface
    {...props}
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: useSurfaceColor(),
      borderRadius: '1.6rem',
      padding: '2.4rem',
    }}
  >
    <div css={{ marginBottom: '4.7rem' }}>
      <Skeleton.Foreground css={{ height: '5.6rem', marginBottom: '2.4rem' }} />
      <Skeleton.Foreground css={{ height: '11.7rem' }} />
    </div>
    <Skeleton.Foreground css={{ height: '4rem' }} />
  </Skeleton.Surface>
)

export default DexFormSkeleton
