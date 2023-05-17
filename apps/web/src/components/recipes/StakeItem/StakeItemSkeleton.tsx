import { useTheme } from '@emotion/react'
import { ListItem, Skeleton, type SkeletonProps, Text } from '@talismn/ui'

const StakeItemSkeleton = (props: SkeletonProps) => {
  const theme = useTheme()
  return (
    <Skeleton.Surface
      {...props}
      animate={props.animate}
      css={{
        borderRadius: '0.8rem',
        backgroundColor: theme.color.surface,
      }}
    >
      <ListItem
        leadingContent={<Skeleton.Foreground css={{ width: '4rem', height: '4rem', borderRadius: '2rem' }} />}
        headlineText={
          <Text.Body>
            <Skeleton.Foreground css={{ height: '0.75em', marginBottom: '0.25em', width: 80 }} />
          </Text.Body>
        }
        supportingText={
          <Text.Body>
            <Skeleton.Foreground css={{ height: '0.75em', width: 240 }} />
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
}

export default StakeItemSkeleton
