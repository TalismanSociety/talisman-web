import Skeleton, { SkeletonProps } from '@components/atoms/Skeleton'
import { useTheme } from '@emotion/react'

const InfoSkeleton = (props: SkeletonProps) => {
  const theme = useTheme()

  return (
    <div
      css={{
        'display': 'flex',
        'flexDirection': 'column',
        'gap': '1rem',
        '> :first-of-type': {
          height: '1em',
          width: '100px',
        },
        '> :nth-of-type(2)': {
          height: '1.25em',
          width: '300px',
        },
        '> :nth-of-type(3)': {
          marginTop: '3%',
          width: '420px',
          height: '10rem',
        },
        '> :nth-of-type(4)': {
          marginTop: '5%',
          height: '3em',
          width: '100px',
        },
        '> :nth-of-type(5)': {
          height: '1.25em',
          width: '300px',
        },
      }}
    >
      {Array(5)
        .fill(undefined)
        .map((_, index) => (
          <Skeleton.Surface
            key={index}
            animate={props.animate}
            css={{
              'borderRadius': '1rem',
              'width': '420px',
              'height': '2em',
              'backgroundColor': theme.color.surface,
              '@media (min-width: 1024px)': {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            }}
          ></Skeleton.Surface>
        ))}
    </div>
  )
}

export default InfoSkeleton
