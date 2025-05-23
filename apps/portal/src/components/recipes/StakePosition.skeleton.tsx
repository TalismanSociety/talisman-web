import type { SkeletonProps } from '@talismn/ui/atoms/Skeleton'
import { Skeleton } from '@talismn/ui/atoms/Skeleton'
import { useSurfaceColor } from '@talismn/ui/atoms/Surface'
import { Text } from '@talismn/ui/atoms/Text'
import { ListItem } from '@talismn/ui/molecules/ListItem'

export const StakePositionSkeleton = (props: SkeletonProps) => (
  <Skeleton.Surface
    {...props}
    animate={props.animate}
    css={{
      borderRadius: '0.8rem',
      backgroundColor: useSurfaceColor(),
    }}
  >
    <ListItem
      leadingContent={<Skeleton.Foreground css={{ width: '4rem', height: '4rem', borderRadius: '2rem' }} />}
      headlineContent={
        <Text.Body>
          <Skeleton.Foreground css={{ height: '0.75em', marginBottom: '0.25em', width: 80 }} />
        </Text.Body>
      }
      supportingContent={
        <Text.Body>
          <Skeleton.Foreground css={{ height: '0.75em', width: 140 }} />
        </Text.Body>
      }
      trailingContent={
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Text.BodyLarge as="div" css={{ fontWeight: 'bold' }}>
            <Skeleton.Foreground css={{ height: '0.75em', marginBottom: '0.25em', width: 80 }} />
          </Text.BodyLarge>
          <Skeleton.Foreground css={{ height: '0.75em', width: 60 }} />
        </div>
      }
    />
  </Skeleton.Surface>
)
