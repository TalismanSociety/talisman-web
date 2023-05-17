import { useTheme } from '@emotion/react'
import { Skeleton, type SkeletonProps } from '@talismn/ui'

const PoolStakeSkeleton = (props: SkeletonProps) => {
  const theme = useTheme()
  return (
    <Skeleton.Surface
      animate={props.animate}
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'gap': '2rem',
        'padding': '1.6rem',
        'borderRadius': '1.6rem',
        'backgroundColor': theme.color.surface,
        '@media (min-width: 1024px)': {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      }}
    >
      {Array(4)
        .fill(undefined)
        .map((_, index) => (
          <div key={index} css={{ display: 'flex', justifyContent: 'space-between' }}>
            <div
              css={{
                'width': '6rem',
                'height': '1.8rem',
                'backgroundColor': theme.color.foreground,
                'borderRadius': '1.2rem',
                '@media (min-width: 1024px)': {
                  display: 'none',
                },
              }}
            />
            <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
              <div
                css={{
                  width: '16rem',
                  height: '1.8rem',
                  backgroundColor: theme.color.foreground,
                  borderRadius: '1.2rem',
                }}
              />
              <div
                css={{
                  width: '5rem',
                  height: '1.8rem',
                  backgroundColor: theme.color.foreground,
                  borderRadius: '1.2rem',
                }}
              />
            </div>
          </div>
        ))}
      <div
        css={{
          'flex': 0.445,
          'display': 'flex',
          'justifyContent': 'space-between',
          'gap': '1rem',
          '> div': {
            flex: 1,
            height: '4.4rem',
            backgroundColor: theme.color.foreground,
            borderRadius: '1.2rem',
          },
        }}
      >
        <div />
        <div />
        <div />
      </div>
    </Skeleton.Surface>
  )
}

export default PoolStakeSkeleton
